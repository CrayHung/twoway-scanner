package com.twoway.Xinwu.config;

import java.io.IOException;
// import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SocketTextHandler extends TextWebSocketHandler {
  /* static 讓其它 java class 可以存取 */
  private static final List<WebSocketSession> sessionList = new ArrayList<>();

  public static List<WebSocketSession> getSessionList() {
    return sessionList;
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    sessionList.add(session);
    // System.out.println("Connect " + session.toString() + " @ " +
    // LocalDateTime.now().toString());
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    sessionList.remove(session);
    // System.out.println("Disconnect " + session.toString() + " @ " +
    // LocalDateTime.now().toString());
  }

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message)
      throws InterruptedException, IOException {

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
}
