package com.twoway.Xinwu.webSocket;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

// import java.io.IOException;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twoway.Xinwu.webSocket.MyWebSocketHandler;
import com.twoway.Xinwu.config.SocketTextHandler;

@Component
public class WsMessageTool {

  // public void sendWsMessage(String type) {
  //   Map<String, String> wsData = new HashMap<>();
  //   wsData.put("type", type);
  
  //   try {
  //     ObjectMapper objectMapper = new ObjectMapper();
  //     String jsonData = objectMapper.writeValueAsString(wsData);
  //     for (WebSocketSession session : MyWebSocketHandler.getSessionList()) {
  //       try {
  //         session.sendMessage(new TextMessage(jsonData));
  //       } catch (IllegalStateException e) {
  //         // 如果是 close session ，移出 session list
  //         MyWebSocketHandler.getSessionList().remove(session);
  //       } catch (Exception e) {
  //         e.printStackTrace();
  //       }
  //     }
  //   } catch (JsonProcessingException e) {
  //     e.printStackTrace();
  //   }
  // }
  /*送單一字串 */
  // public void sendWsMessage(String message) {
  //   for (WebSocketSession session : MyWebSocketHandler.getSessionList()) {
  //     try {
  //       session.sendMessage(
  //           new TextMessage(message));
  //           System.out.println("有執行session.sendMessage(new TextMessage(message));");
  //     } catch (IllegalStateException e) {
  //       // 如果是 close session ，移出 session list
  //       MyWebSocketHandler.getSessionList().remove(session);
  //       System.out.println("沒有執行session.sendMessage(new TextMessage(message));");
  //     } catch (Exception e) {
  //       e.printStackTrace();
  //     }
  //   }
  // }



/*送單一字串 */
  // public void sendWsMessage(String message) {
  //   for (WebSocketSession session : SocketTextHandler.getSessionList()) {
  //     try {
  //       session.sendMessage(
  //           new TextMessage(message));
  //     } catch (IllegalStateException e) {
  //       // 如果是 close session ，移出 session list
  //       SocketTextHandler.getSessionList().remove(session);
  //     } catch (Exception e) {
  //       e.printStackTrace();
  //     }
  //   }
  // }
  

  private final SocketTextHandler socketTextHandler;

  
  public WsMessageTool(SocketTextHandler socketTextHandler) {
      this.socketTextHandler = socketTextHandler;
  }

  public void sendWsMessage(String message) {
      for (WebSocketSession session : socketTextHandler.getSessionList()) {
          try {
              session.sendMessage(new TextMessage(message));
          } catch (IllegalStateException e) {
              // 如果是 close session ，移出 session list
              socketTextHandler.getSessionList().remove(session);
          } catch (Exception e) {
              e.printStackTrace();
          }
      }
  }






// /*如果要傳送List , 改寫成以下sendWsMessage */
  // public void sendWsMessage(List<String> message) {

  //   ObjectMapper objectMapper = new ObjectMapper();

  //   // 將 List 轉換成 JSON 字串
  //   String jsonMessage;
  //   try {
  //       jsonMessage = objectMapper.writeValueAsString(message);
  //   } catch (JsonProcessingException e) {
  //       // 處理 JSON 轉換異常
  //       e.printStackTrace();
  //       return;
  //   }

  //   for (WebSocketSession session : MyWebSocketHandler.getSessionList()) {
  //     try {
  //       session.sendMessage(
  //           new TextMessage(jsonMessage));
  //     } catch (IllegalStateException e) {
  //       // 如果是 close session ，移出 session list
  //       MyWebSocketHandler.getSessionList().remove(session);
  //     } catch (Exception e) {
  //       e.printStackTrace();
  //     }
  //   }
  // }
// /*如果要傳送List , 改寫成以下sendWsMessage */

}
