package com.twoway.Xinwu.webSocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

public class MyWebSocketHandler extends TextWebSocketHandler {
  private static final List<WebSocketSession> sessionList = new ArrayList<>();
  private static final ObjectMapper objectMapper = new ObjectMapper();

  public static List<WebSocketSession> getSessionList() {
    return sessionList;
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    sessionList.add(session);
    System.out.println("WebSocket連接已建立");
  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    try {
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
      System.out.println(textMessage);
      for (WebSocketSession session : sessionList) {
        System.out.println("ws傳出的資料:"+textMessage);
        session.sendMessage(textMessage);
      }
    } catch (IOException e) {
      System.out.println("Error broadcasting message: " + e.getMessage());
    }
  }
}
