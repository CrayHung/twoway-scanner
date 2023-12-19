package com.twoway.Xinwu.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.WebSocketMessage;

import com.twoway.Xinwu.entity.AllowList;
import com.twoway.Xinwu.entity.AllowListRepository;
import com.twoway.Xinwu.entity.ParkingLot;
import com.twoway.Xinwu.entity.ParkingLotRepository;


//for websocket
/*
SimpMessagingTemplate有兩個推送方法
1. convertAndSend(destination , payload) //將消息廣播到特定的訂閱路徑 ,  類似@SendTo
2. convertAndSendToUser(user , destination , payload) //將消息推送到固定的用戶訂閱路經 , 類似@SendToUser
*/
// import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.twoway.Xinwu.entity.Record;
import com.twoway.Xinwu.entity.RecordRepository;
import com.twoway.Xinwu.entity.Speeding;
import com.twoway.Xinwu.entity.SpeedingRepository;
import com.twoway.Xinwu.model.recordSearch;
import com.twoway.Xinwu.service.WebSocketService;
import com.twoway.Xinwu.webSocket.WsMessageTool;

// import org.springframework.stereotype.Controller;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/lpr")
public class LprController {

  @Autowired
  private RecordRepository recordRepository;

  @Autowired
  private AllowListRepository allowListRepository;

  @Autowired
  private ParkingLotRepository parkingLotRepository;

  @Autowired
  private SpeedingRepository speedingRepository;
  

  @Autowired
  private WebSocketService websocketService;


  // 偵測長度(公尺)
  private static final long DETECT_LENGTH = 25;
  // 場內最高速限 (km/hr)
  private static final long LINIT_SPEED = 25;
  // 比對 當前資料 和 DB資料 的時間間隔
  private static final long TIME_BETWEEN_NEW_AND_DB = 30;

  // 車號+日期+進出 搜尋
  @PostMapping("/all/search")
  public Iterable<Record> searchByDateByPlatenumberByPlateIn(@RequestBody recordSearch recordsearch) {

    String platenumber = recordsearch.getPlateNumber();
    String startDate = recordsearch.getStartDate();
    String endDate = recordsearch.getEndDate();
    Boolean plateIn = recordsearch.getPlateIn();

    return recordRepository.searchByDateByPlateNumberByPlateIn(platenumber, startDate, endDate, plateIn);

  }

  // 返回所有
  @GetMapping("/all")
  public Iterable<Record> getAllRecordByIdDesc() {
    return recordRepository.findAllByOrderByIdDesc();
  }

  // 正確車號
  @GetMapping("/all/{plateNumber}")
  public Iterable<Record> getAllRecordByPlateNumber(@PathVariable String plateNumber) {
    return recordRepository.findByPlateNumber(plateNumber);
  }

  // 最新一筆 plateNumber
  @GetMapping("/latest/{plateNumber}")
  public Optional<Record> getFirstByPlateNumberOrderByRecognitionTimeDesc(@PathVariable String plateNumber) {
    return recordRepository.findFirstByPlateNumberOrderByIdDesc(plateNumber);
  }

  // 日期區間
  @PostMapping("/all/searchDateBetween")
  public Iterable<Record> getRecordByDate(@RequestBody recordSearch recordsearch) {
    String startDate = recordsearch.getStartDate();
    String endDate = recordsearch.getEndDate();
    return recordRepository.searchByDateBetween(startDate, endDate);
  }

  // 日期區間+模糊車號
  // @PostMapping("/all/searchDateAndPlateNumber")
  // public Iterable<Record> getRecordByDateAndPlateNumber(@RequestBody
  // recordSearch recordsearch) {
  // String platenumber = recordsearch.getPlateNumber();
  // String startDate = recordsearch.getStartDate();
  // String endDate = recordsearch.getEndDate();
  // return
  // recordRepository.searchByDateBetweenAndPlateNumber(platenumber,startDate,endDate);
  // }

  // 進出場 , false=尚在停車場內
  @PostMapping("/all/searchPlateIn")
  public Iterable<Record> searchByPlate(@RequestBody recordSearch recordsearch) {
    Boolean plateIn = recordsearch.getPlateIn();
    return recordRepository.searchByPlateIn(plateIn);
  }

  // 模糊車號+尚在場內
  @PostMapping("/all/searchPlateNumberPlateInFalse")
  public Iterable<Record> getRecordByDateAndPlateNumber(@RequestBody recordSearch recordsearch) {
    String platenumber = recordsearch.getPlateNumber();
    return recordRepository.searchByPlateNumberNotSureAndPlateInFalse(platenumber);
  }

  // 模糊車號
  @PostMapping("/all/searchPlateNumber")
  public Iterable<Record> getByPlateNumberNotSure(@RequestBody recordSearch recordsearch) {
    String platenumber = recordsearch.getPlateNumber();
    return recordRepository.searchByPlateNumberNotSure(platenumber);
  }

  // lpr丟車牌
  @PostMapping("/event")
  public String lprEventPost(@RequestBody Record record) {
    String platenumber = record.getPlateNumber();

    /*****************
     * 比對車牌是否是白名單車輛 或 預約車輛
     * PassStatus含三種字串 "pass", "temp_pass" , ""
     * 根據 visitorEndStr和當前時間比較 判斷是否放行
     ****************/
    Boolean found = false;
    List<AllowList> allowLists = allowListRepository.findByPlateNumber(platenumber);

    WsMessageTool wsMessageTool = new WsMessageTool();
    List<String> messages = new ArrayList<>();

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    for (AllowList alInDb : allowLists) {
      if (alInDb.getPassStatus().equals("pass")) {
        found = true;
        break;
      }
    }
    for (AllowList alInDb : allowLists) {
      if (alInDb.getPassStatus().equals("temp_pass")) {
        LocalDateTime visitorEndDateTime = LocalDateTime.parse(alInDb.getVisitorEndStr(), formatter);

        LocalDateTime currentDateTime = LocalDateTime.now();

        if (currentDateTime.isBefore(visitorEndDateTime)) {
          // messages.add("車號:"+platenumber+"預約時間:"+visitorEndDateTime+"請進");
          found = true;
          break;
        }
        // else messages.add("車號:"+platenumber+"預約時間:"+visitorEndDateTime+"已超過");
      }
    }

    // 根據最近一筆資料判斷此車是要進 還是出(plateIn=false) , 如沒有歷史紀錄則代表要進
    Optional<Record> lastMatchingData = recordRepository.findFirstByPlateNumberOrderByIdDesc(platenumber);
    // Integer car_amount = recordRepository.countByPlateAllreadyInside();
    String car_type = record.getCarType();
    ParkingLot parkingLot = parkingLotRepository.findByCarType(car_type);
    Integer car_amount = parkingLotRepository.findAllByCarTypeByAmount(car_type);

    System.out.println("車位數" + car_amount);
    // 有歷史紀錄
    if (lastMatchingData.isPresent()) {

      Record lastrecord = lastMatchingData.get();
      boolean previousPIn = lastrecord.getPlateIn();
      // 如要進 , 判斷車位夠嗎
      if (previousPIn && car_amount > 0) {
        if (found) {
          record.setPlateIn(false);
          recordRepository.save(record);
          messages.add("車型:" + car_type + "車號:" + platenumber + "請進");

          car_amount--;
          System.out.println("車位數" + car_amount);
          parkingLot.setAmount(car_amount);
          parkingLotRepository.save(parkingLot);

        } else {
          messages.add("車號:" + platenumber + "未核准進入");
        }
      }
      // 出 , 看要不要增加符合過磅條件
      else if (!previousPIn) {
        lastrecord.setPlateIn(true);
        recordRepository.save(lastrecord);

        record.setPlateIn(true);
        recordRepository.save(record);

        messages.add("請離場");
        car_amount++;
        parkingLot.setAmount(car_amount);
        parkingLotRepository.save(parkingLot);

      } else {
        messages.add("車位已滿");
      }
    }

    // 沒有歷史紀錄的車牌 ,
    else {
      if (car_amount > 0) {
        if (found) {
          record.setPlateIn(false);
          recordRepository.save(record);
          messages.add("車型:" + car_type + "車號:" + platenumber + "請進");
          car_amount++;
          parkingLot.setAmount(car_amount);
          parkingLotRepository.save(parkingLot);
        } else {
          messages.add("車號:" + platenumber + "未核准進入");
        }
      } else {
        messages.add("車位已滿");
      }
    }
    // Integer new_car_amount = recordRepository.countByPlateAllreadyInside();
    Integer new_car_amount = parkingLotRepository.findAllByCarTypeByAmount(car_type);
    messages.add("車型:" + car_type + "的剩餘車位數:" + (new_car_amount));

    /* for cam ID */
    messages.add("攝影機:" + record.getCameraId());

    // System.out.println(messages);
    // wsMessageTool.sendWsMessage(messages);

    // [WS] for Live
    /* 傳送單一字串 */
    // WsMessageTool wsMessageTool = new WsMessageTool();
    // wsMessageTool.sendWsMessage(platenumber);

    // [WS] for Live
    /* 如果要傳送List , 改寫WsMessageTool的sendWsMessage */
    // WsMessageTool wsMessageTool = new WsMessageTool();
    // List<String> messages = Arrays.asList("目前場內車數:"+car_amount ,
    // "剩餘停車數:"+(5-car_amount));
    // wsMessageTool.sendWsMessage(messages);

    // [WS] for Live
    /* 如果要傳送Json , 改寫WsMessageTool的sendWsMessage */
    // WsMessageTool wsMessageTool = new WsMessageTool();
    Map<String, String> wsData = new HashMap<>();
    wsData.put("cameraId", record.getCameraId());
    wsData.put("imagePath", record.getImagePath());
    wsData.put("plateNumber", record.getPlateNumber());
    JSONObject json = new JSONObject();
    json.put("type", "live");
    wsData.put("palteIn", String.valueOf(record.getPlateIn()));
    json.put("data", wsData);
    wsMessageTool.sendWsMessage(json.toString());

    return "成功";

  }

  /* 平均速度 判斷邏輯 */
  /*
   * 如果場內限速25km/hr , 代表速度小於 25*1000/60*60 = 6.95公尺/秒
   * 25公尺情況下 , 如果cam1和cam2的差值 小於 3.597秒的話
   * 則代表超速 , 要將資料存下來
   * 
   * 
   */
  @PostMapping("/speedingEvent")
  public String lprEventSpeedingPost(@RequestBody Speeding speeding) {
    
    String platenumber = speeding.getPlateNumber();
    String camera = speeding.getCameraId();
    String recognitionTimeStr=speeding.getRecognitionTimeStr();

    //場內最高限速轉換成公尺/秒
    long limitSpeed = (LINIT_SPEED*1000)/3600;

    // 時間差timeDifference, 初始值為0
    long timeDifference = 0;
    // 速度speed, 初始值為0
    long avgSpeed = 0;
    System.out.println(platenumber);
    System.out.println(camera);
    // 如果從A攝影機進,就從DB中找攝影機B的上一筆資料
    if ("cam1".equals(camera) ) {
      System.out.println("從cam1進來");
      Optional<Speeding> sameCarInDB = speedingRepository.findByCameraIdByPlateNumber("cam2", platenumber);

      // if (sameCarInDB.isPresent() && sameCarInDB.get().getRecognitionTime() != null && speeding.getRecognitionTime() != null) {
      if (sameCarInDB.isPresent() ) {
        System.out.println("有sameCarInDB");

        Duration duration = Duration.between(sameCarInDB.get().getRecognitionTime(), speeding.getRecognitionTime());
        timeDifference = Math.abs(duration.getSeconds());
        if (timeDifference != 0) {
          avgSpeed = (DETECT_LENGTH) / (timeDifference);
        } else{
          avgSpeed=999;
        }

        if(avgSpeed >= limitSpeed && timeDifference <= TIME_BETWEEN_NEW_AND_DB) {
          speeding.setAvgSpeed(avgSpeed);
          speedingRepository.save(speeding);
          websocketService.processAndBroadcastData(platenumber, recognitionTimeStr, camera);
          return "另一隻攝影機有相同車號 , 超速 + 時間小於30秒---真正超速  車速:"+avgSpeed*3.6+"km/hr";
        }
        else if(avgSpeed >= limitSpeed && timeDifference > TIME_BETWEEN_NEW_AND_DB){
          speedingRepository.save(speeding);
          return "另一隻攝影機有相同車號 , 超速 + 時間超過30秒---不太可能發生的狀況(時速超快)";
        }
        else if(avgSpeed < limitSpeed && timeDifference <= TIME_BETWEEN_NEW_AND_DB){
          speedingRepository.save(speeding);
          return "另一隻攝影機有相同車號 , 沒超速 + 時間小於30秒---此為正常駕駛  車速:"+avgSpeed*3.6+"km/hr";
        }
        //avgSpeed < limitSpeed && timeDifference > TIME_BETWEEN_NEW_AND_DB
        else{
          speedingRepository.save(speeding);
          return "另一隻攝影機有相同車號 , 沒超速 + 超過30秒---代表兩車為不同時段";
        }
      } 
      else{
        System.out.println("沒有sameCarInDB");
        speedingRepository.save(speeding);
        return "沒有 另一隻攝影機的 相同車號";
      }
    }

    else if ("cam2".equals(camera) ) {
      System.out.println("從cam2進來");
      Optional<Speeding> sameCarInDB = speedingRepository.findByCameraIdByPlateNumber("cam1", platenumber);

      // if (sameCarInDB.isPresent() && sameCarInDB.get().getRecognitionTime() != null && speeding.getRecognitionTime() != null) {
      if (sameCarInDB.isPresent() ) {
        System.out.println("有sameCarInDB");

        Duration duration = Duration.between(sameCarInDB.get().getRecognitionTime(), speeding.getRecognitionTime());
        timeDifference = Math.abs(duration.getSeconds());
        if (timeDifference != 0) {
          avgSpeed = (DETECT_LENGTH) / (timeDifference);
        } else{
          avgSpeed=999;
        }
        System.out.println(timeDifference);
        System.out.println(avgSpeed);

        if (avgSpeed >= limitSpeed && timeDifference <= TIME_BETWEEN_NEW_AND_DB) {
          speeding.setAvgSpeed(avgSpeed);
          speedingRepository.save(speeding);
          websocketService.processAndBroadcastData(platenumber, recognitionTimeStr, camera);
          return "另一隻攝影機有相同車號 , 超速 + 時間小於30秒---真正超速  車速:"+avgSpeed*3.6+"km/hr";
        }
        else if(avgSpeed >= limitSpeed && timeDifference > TIME_BETWEEN_NEW_AND_DB){
          speedingRepository.save(speeding);
          return "另一隻攝影機有相同車號 , 超速 + 時間超過30秒---不太可能發生的狀況(時速超快)";
        }
        else if(avgSpeed < limitSpeed && timeDifference <= TIME_BETWEEN_NEW_AND_DB){
          speedingRepository.save(speeding);
          return "另一隻攝影機有相同車號 , 沒超速 + 時間小於30秒---此為正常駕駛  車速:"+avgSpeed*3.6+"km/hr";
        }
        //avgSpeed < limitSpeed && timeDifference > TIME_BETWEEN_NEW_AND_DB
        else{
          speedingRepository.save(speeding);
          return "另一隻攝影機有相同車號 , 沒超速 + 超過30秒---代表兩車為不同時段";
        }
      } 
      else{
        System.out.println("沒有sameCarInDB");
        speedingRepository.save(speeding);
        return "沒有 另一隻攝影機的 相同車號";
      }
    }
    else{
      return "沒有cameraID資訊";
    }
 


  }





  
  // 將每支攝影機最新的一筆車子資料回傳
  @GetMapping("/cams/latest")
  public Map<String, Record> getAllLatestRecordByCam() {
    Map<String, Record> latestCamsMap = new HashMap<>();

    latestCamsMap.put("cam1", latestCamsTool("cam1"));
    latestCamsMap.put("cam2", latestCamsTool("cam2"));

    return latestCamsMap;
  }

  public Record latestCamsTool(String cameraId) {
    Optional<Record> opr = recordRepository.findAllLatestRecordByCameraId(cameraId);

    if (opr.isPresent()) {
      return opr.get();
    } else {
      return null;
    }
  }

}
