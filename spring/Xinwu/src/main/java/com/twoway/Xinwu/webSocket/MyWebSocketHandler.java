package com.twoway.Xinwu.webSocket;


import java.util.ArrayList;
import java.util.List;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


public class MyWebSocketHandler extends TextWebSocketHandler {
    private static final List<WebSocketSession> sessionList = new ArrayList<>();

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
}
