package com.twoway.Xinwu.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
import com.twoway.Xinwu.model.recordSearch;
import com.twoway.Xinwu.webSocket.WsMessageTool;


// import org.springframework.stereotype.Controller;


@CrossOrigin(origins = "*" )
@RestController
@RequestMapping("/lpr")
public class LprController {

    @Autowired
    private RecordRepository recordRepository;
    
    @Autowired
    private AllowListRepository allowListRepository;

    @Autowired
    private ParkingLotRepository parkingLotRepository;
    
    //車號+日期+進出 搜尋
    @PostMapping("/all/search")
    public Iterable<Record> searchByDateByPlatenumberByPlateIn(@RequestBody recordSearch recordsearch) {

      String platenumber = recordsearch.getPlateNumber();
      String startDate = recordsearch.getStartDate();
      String endDate = recordsearch.getEndDate();
      Boolean plateIn = recordsearch.getPlateIn();

      return recordRepository.searchByDateByPlateNumberByPlateIn(platenumber,startDate,endDate,plateIn);

    }

    // 返回所有
    @GetMapping("/all")
    public Iterable<Record> getAllRecordByIdDesc() {
      return recordRepository.findAllByOrderByIdDesc();
    }

    // 正確車號
    @GetMapping("/all/{plateNumber}")
    public Iterable<Record> getAllRecordByPlateNumber (@PathVariable String plateNumber) {
      return recordRepository.findByPlateNumber(plateNumber);
    }

    // 最新一筆 plateNumber
    @GetMapping("/latest/{plateNumber}")
    public Optional<Record> getFirstByPlateNumberOrderByRecognitionTimeDesc (@PathVariable String plateNumber) {
      return recordRepository.findFirstByPlateNumberOrderByIdDesc(plateNumber);
    }

    //日期區間
    // @PostMapping("/all/searchDate")
    // public Iterable<Record> getRecordByDate(@RequestBody recordSearch recordsearch) {
    //   String startDate = recordsearch.getStartDate();
    //   String endDate = recordsearch.getEndDate();
    //   return recordRepository.searchByDateBetween(startDate,endDate);
    // }

    //日期區間+模糊車號
    // @PostMapping("/all/searchDateAndPlateNumber")
    // public Iterable<Record> getRecordByDateAndPlateNumber(@RequestBody recordSearch recordsearch) {
    //   String platenumber = recordsearch.getPlateNumber();
    //   String startDate = recordsearch.getStartDate();
    //   String endDate = recordsearch.getEndDate();
    //   return recordRepository.searchByDateBetweenAndPlateNumber(platenumber,startDate,endDate);
    // }


    //進出場  , false=尚在停車場內
    @PostMapping("/all/searchPlateIn")
    public Iterable<Record> searchByPlate(@RequestBody recordSearch recordsearch) {
      Boolean plateIn = recordsearch.getPlateIn();
      return recordRepository.searchByPlateIn( plateIn);
    }

    //模糊車號+尚在場內
    @PostMapping("/all/searchPlateNumberPlateInFalse")
    public Iterable<Record> getRecordByDateAndPlateNumber(@RequestBody recordSearch recordsearch) {
      String platenumber = recordsearch.getPlateNumber();
      return recordRepository.searchByPlateNumberNotSureAndPlateInFalse(platenumber);
    }


    //模糊車號
    @PostMapping("/all/searchPlateNumber")
    public Iterable<Record> getByPlateNumberNotSure(@RequestBody recordSearch recordsearch) {
      String platenumber = recordsearch.getPlateNumber();
      return recordRepository.searchByPlateNumberNotSure(platenumber);
    }


    // 丟車牌
    @PostMapping("/event")
    public String lprEventPost(@RequestBody Record record) {
      String platenumber = record.getPlateNumber();

      /*****************
       * 比對車牌是否是白名單車輛 或 預約車輛 
       * PassStatus含三種字串   "pass", "temp_pass" , ""
       * 根據 visitorEndStr和當前時間比較  判斷是否放行
       * ****************/
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

            if(currentDateTime.isBefore(visitorEndDateTime)){
              // messages.add("車號:"+platenumber+"預約時間:"+visitorEndDateTime+"請進");
              found = true;
              break;
            }
            // else messages.add("車號:"+platenumber+"預約時間:"+visitorEndDateTime+"已超過");
          }
        }





      //根據最近一筆資料判斷此車是要進 還是出(plateIn=false) , 如沒有歷史紀錄則代表要進
      Optional<Record> lastMatchingData = recordRepository.findFirstByPlateNumberOrderByIdDesc(platenumber);
      //Integer car_amount = recordRepository.countByPlateAllreadyInside();
      String car_type = record.getCarType();
      ParkingLot parkingLot = parkingLotRepository.findByCarType(car_type);
      Integer car_amount = parkingLotRepository.findAllByCarTypeByAmount(car_type);

      System.out.println("車位數"+car_amount);
      //有歷史紀錄
      if(lastMatchingData.isPresent()){

        Record lastrecord = lastMatchingData.get();
        boolean previousPIn = lastrecord.getPlateIn();
        //如要進 , 判斷車位夠嗎
        if(previousPIn && car_amount>0){
          if(found){
            record.setPlateIn(false);
            recordRepository.save(record);
            messages.add("車型:"+car_type+"車號:"+platenumber+"請進");

            car_amount --;
            System.out.println("車位數"+car_amount);
            parkingLot.setAmount(car_amount);
            parkingLotRepository.save(parkingLot);

          }
          else{
            messages.add("車號:"+platenumber+"未核准進入");
          }
        }
        //出 , 看要不要增加符合過磅條件
        else if(!previousPIn){
          lastrecord.setPlateIn(true);
          recordRepository.save(lastrecord);

          record.setPlateIn(true);
          recordRepository.save(record);

          messages.add("請離場");
          car_amount ++;
          parkingLot.setAmount(car_amount);
          parkingLotRepository.save(parkingLot);

        }
        else{
          messages.add("車位已滿");
        }
      }

      //沒有歷史紀錄的車牌 , 
      else{
        if(car_amount>0){     
          if(found){
            record.setPlateIn(false);
            recordRepository.save(record);
            messages.add("車型:"+car_type+"車號:"+platenumber+"請進");
            car_amount ++;
            parkingLot.setAmount(car_amount);
            parkingLotRepository.save(parkingLot);
          }
          else{
            messages.add("車號:"+platenumber+"未核准進入");
          }
        }
        else{
            messages.add("車位已滿");
          }
      }
    //Integer new_car_amount = recordRepository.countByPlateAllreadyInside();
    Integer new_car_amount = parkingLotRepository.findAllByCarTypeByAmount(car_type);
    messages.add("車型:"+car_type+"的剩餘車位數:"+(new_car_amount));

    /*for cam ID */
    messages.add("攝影機:"+record.getCameraId());

    System.out.println(messages);
    wsMessageTool.sendWsMessage(messages);



    // [WS] for Live 
      /*傳送單一字串 */
      // WsMessageTool wsMessageTool = new WsMessageTool();
      // wsMessageTool.sendWsMessage(platenumber);

    // [WS] for Live 
      /*如果要傳送List , 改寫WsMessageTool的sendWsMessage */
      // WsMessageTool wsMessageTool = new WsMessageTool();
      // List<String> messages = Arrays.asList("目前場內車數:"+car_amount , "剩餘停車數:"+(5-car_amount));
      // wsMessageTool.sendWsMessage(messages);

      return "成功";

      
      }





    // 將每支攝影機最新的一筆車子資料回傳
    @GetMapping("/cams/latest")
    public Map<String, Record> getAllLatestRecordByCam() {
      Map<String, Record> latestCamsMap = new HashMap<>();
  
      latestCamsMap.put("cam1", latestCamsTool("CAM1"));
      latestCamsMap.put("cam2", latestCamsTool("CAM2"));

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
