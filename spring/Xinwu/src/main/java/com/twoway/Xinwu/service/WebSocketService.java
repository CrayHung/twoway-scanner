/*
此service主要將post進來的record或speeding資料,換成
    {
    "cam1":{
        "plateNumber":"保留上一筆cameraId=cam1的plateNumber",
        "recognitionTimeStr":"保留上一筆cameraId=cam1的recognitionTimeStr"},
    "cam2":{
        "plateNumber":"abc-886",
        "recognitionTimeStr":"2023-12-16 00:00:00"},
    }
 並透過ws廣播出去

 */
package com.twoway.Xinwu.service;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.twoway.Xinwu.webSocket.MyWebSocketHandler;

@Service
public class WebSocketService {

    private Map<String, Map<String, String>> cameraData = new HashMap<>();

    public void processAndBroadcastData(String plateNumber, String recognitionTimeStr, String cameraId) {
        
        System.out.println("進入websocketService");
        Map<String, String> newData = new HashMap<>();
        newData.put("plateNumber", plateNumber);
        newData.put("recognitionTimeStr", recognitionTimeStr);

        cameraData.compute(cameraId, (key, existingData) -> {
            if (existingData == null) {
                existingData = new HashMap<>();
            }
            existingData.putAll(newData);
            return existingData;
        });

        Map<String, Map<String, String>> broadcastData = new HashMap<>(cameraData);   
        //將資料透過ws廣播出去
        MyWebSocketHandler.broadcastMessage(broadcastData);

    }
}
