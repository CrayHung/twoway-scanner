package com.twoway.Xinwu.webSocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;

public class MyWebSocketHandler extends TextWebSocketHandler {
  private static final List<WebSocketSession> sessionList = new ArrayList<>();
  private static final ObjectMapper objectMapper = new ObjectMapper();

  public static List<WebSocketSession> getSessionList() {
    System.out.println("有執行getSessionList"+sessionList);
    return sessionList;
  }


//   @Override
//   public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//     sessionList.add(session);
//     System.out.println("WebSocket連接已建立");
//   // 在這裡驗證 JWT
//     HttpHeaders headers = session.getHandshakeHeaders();
//     List<String> authorizationHeaders = headers.get(HttpHeaders.AUTHORIZATION);

//     if (authorizationHeaders != null && !authorizationHeaders.isEmpty()) {
//         String token = authorizationHeaders.get(0).replace("Bearer ", "");

//         try {
//             // 驗證 JWT
//             Jwts.parser().setSigningKey("f055902968528c61af559aca12f237dbbe88e4b7ebc9ce8ca5a6bf608abce834").parseClaimsJws(token);

//             // JWT 驗證成功，繼續處理 WebSocket 連線
//         } catch (ExpiredJwtException e) {
//             // JWT 已過期
//             System.out.println("JWT 已過期");
//             session.close(CloseStatus.NOT_ACCEPTABLE);
//         } catch (Exception e) {
//             // 其他 JWT 驗證錯誤
//             System.out.println("JWT 驗證錯誤");
//             session.close(CloseStatus.NOT_ACCEPTABLE);
//         }
//     } else {
//         // 無法取得 Authorization 標頭
//         System.out.println("無法取得 Authorization 標頭");
//         session.close(CloseStatus.NOT_ACCEPTABLE);
//     }
// }



  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    sessionList.add(session);
    System.out.println("WebSocket連接已建立");
  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) throws InterruptedException, IOException {
    try {
      System.out.println("執行handleTextMessage");
      for (WebSocketSession sessionInList : sessionList) {
        if (sessionInList != session) {
          sessionInList.sendMessage(message);
        }
      }
    } catch (Exception e) {
      System.out.println("Exception message: " + e.getLocalizedMessage());
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    sessionList.remove(session);
    System.out.println("WebSocket連接close");
  }


  /* */
  public static void broadcastMessage(Map<String, Map<String, String>> broadcastData) {
    System.out.println("進入broadcastMessage");
    try {
      String jsonData = objectMapper.writeValueAsString(broadcastData);
      System.out.println(jsonData);
      
      TextMessage textMessage = new TextMessage(jsonData);
      for (WebSocketSession session : sessionList) {
        System.out.println("ws傳出的資料:"+textMessage);
        session.sendMessage(textMessage);
      }
    } catch (JsonProcessingException e) {
      System.out.println("Error converting broadcastData to JSON: " + e.getMessage());
  } catch (IOException e) {
      System.out.println("Error broadcasting message: " + e.getMessage());
  }
  }
}
