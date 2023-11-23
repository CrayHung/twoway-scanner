package com.twoway.Xinwu.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.entity.AllowList;
import com.twoway.Xinwu.entity.AllowListRepository;

@CrossOrigin(origins = "*" )
@RestController
@RequestMapping("/allow")
public class AllowListController {

    @Autowired
    private AllowListRepository allowListRepository;

    //所有白名單+預約名單 (含過往歷史紀錄)
    @GetMapping("/all")
    Iterable<AllowList> getAllAllowList() {
      return allowListRepository.findByPassStatusOrderByIdDesc();
    }

    //所有白名單
    @GetMapping("/all/white")
    Iterable<AllowList> getAllWhiteAllowList() {
      return allowListRepository.findWhiteByPassStatusOrderByIdDesc();
    }

    //所有預約名單
    @GetMapping("/all/tempPass")
    Iterable<AllowList> getAllTempPassAllowList() {
      return allowListRepository.findPassByPassStatusOrderByIdDesc();
    }

    //顯示還有效的預約名單 (end時間 > 當前時間)
    @GetMapping("/all/visitorBooking")
    Optional<Iterable<AllowList>> getAllVisitorAllowListNotExpired() {
      return allowListRepository.findVisitorByPassStatusOrderByIdDesc();
    }

    //新增白名單
    @PostMapping("/addNewWhite")
    public String addnewWhiteList(@RequestBody AllowList allowList) {
        allowList.setPassStatus("pass");
        allowListRepository.save(allowList);
        return "成功";
    }

    //新增預約名單
    @PostMapping("/addNewTempPass")
    public String addnewTempPassList(@RequestBody AllowList allowList) {
        allowList.setPassStatus("temp_pass");
        allowListRepository.save(allowList);
        return "成功";
    }

    //修改預約名單
    @PostMapping("/modifyTempPassTime")
    public void modifyTempPassList(@RequestBody AllowList allowList) {
        String platenumber = allowList.getPlateNumber();
        String visitor_start_str = allowList.getVisitorStartStr();
        String visitor_end_str = allowList.getVisitorEndStr();
        allowListRepository.modifyTempPass(platenumber,visitor_start_str,visitor_end_str);

        return ;
    }

}
