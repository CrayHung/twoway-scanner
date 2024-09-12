package com.twoway.Xinwu.webSocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
// import org.springframework.messaging.simp.config.MessageBrokerRegistry;
// import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
// import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
// import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.twoway.Xinwu.config.SocketTextHandler;



// @Configuration
// @EnableWebSocket
// public class WebSocketConfig implements WebSocketConfigurer {
    
//     @Override
//     public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//         System.out.println("Registering WebSocket handler...");
//         registry.addHandler(new MyWebSocketHandler(), "/ws")
//                 .setAllowedOrigins("*");
//     }
// }


@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    private final SocketTextHandler socketTextHandler;

    public WebSocketConfig(SocketTextHandler socketTextHandler) {
        this.socketTextHandler = socketTextHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.out.println("Registering WebSocket handler...");
        registry.addHandler(socketTextHandler, "/ws")
                .setAllowedOrigins("*");
    }
}





// @EnableWebSocketMessageBroker
// public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

//     //代理 , 可控制廣播或單點傳送
//     @Override
//     public void configureMessageBroker(MessageBrokerRegistry config) {
//         config.enableSimpleBroker("/topic" ,"/topic/broadcast" , "/user"); // Enables a simple in-memory message broker to send messages to clients on "/topic" destination.
//         config.setApplicationDestinationPrefixes("/app"); // Use "/app" prefix for message mapping.
//         config.setUserDestinationPrefix("/user");
//     }


//     // //ws註冊地址
//     @Override
//     public void registerStompEndpoints(StompEndpointRegistry registry) {
//         registry.addEndpoint("/ws")
//                 .setAllowedOriginPatterns("*")
//                 .withSockJS(); 
//     }


// }
