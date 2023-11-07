package com.twoway.Xinwu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.entity.ParkingLot;
import com.twoway.Xinwu.entity.ParkingLotRepository;

@CrossOrigin(origins = "*" )
@RestController
@RequestMapping("/parking")
public class ParkingLotController {

    @Autowired
    private ParkingLotRepository parkingLotRepository;

    @PostMapping("/addparkinglots")
    public ParkingLot AddParkingLots(@RequestBody ParkingLot parkinglot) {
    return parkingLotRepository.save(parkinglot);
    }

    @GetMapping("/all")
    Iterable<ParkingLot> getAll() {
      return parkingLotRepository.findAll();
    }

    @GetMapping("/all/{carType}")
    ParkingLot getByCarType(@PathVariable String carType) {
      return parkingLotRepository.findByCarType(carType);
    }

    @GetMapping("/alltype")
    Iterable getAllCarType() {
      return parkingLotRepository.findAllCarType();
    }

    @GetMapping("/amount/{carType}")
    Integer getAllByCarTypeByAmount(@PathVariable String carType) {
      return parkingLotRepository.findAllByCarTypeByAmount(carType);
    }

}
