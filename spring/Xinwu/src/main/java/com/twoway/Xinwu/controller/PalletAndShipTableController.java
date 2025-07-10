package com.twoway.Xinwu.controller;


import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.entity.CartonDetailRepository;
import com.twoway.Xinwu.entity.Pallet;
import com.twoway.Xinwu.entity.PalletAndShipTable;
import com.twoway.Xinwu.entity.PalletAndShipTableRepository;
import com.twoway.Xinwu.entity.PalletRepository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api")
public class PalletAndShipTableController {

    @Autowired
    private PalletAndShipTableRepository palletAndShipTableRepository;

    @PostMapping("/get-ship-pallets")
    public ResponseEntity<?> getPalletsByShip(@RequestBody Map<String, String> payload) {
        String shipId = payload.get("shipId");
        if (shipId == null || shipId.isEmpty()) {
            return ResponseEntity.badRequest().body("shipId is required");
        }

        Optional<PalletAndShipTable> shipOptional = palletAndShipTableRepository.findByShipId(shipId);
        if (shipOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ship not found");
        }

        String palletNamesString = shipOptional.get().getPalletNames();
        List<String> palletNames = Arrays.stream(palletNamesString.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("palletNames", palletNames);
        return ResponseEntity.ok(response);
    }

}
