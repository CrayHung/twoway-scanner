package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.twoway.Xinwu.entity.InputMode;
import com.twoway.Xinwu.repository.InputModeRepository;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InputModeController {

    @Autowired
    private InputModeRepository inputModeRepository;

    // POST API
    @PostMapping("/post-input-modes")
    public ResponseEntity<String> createInputMode(@RequestBody InputModeRequest request) {
        if (request.getPartNumber() == null || request.getPartNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("料號不能為空");
        }
        if (request.getInputMode() == null || request.getInputMode().isEmpty()) {
            return ResponseEntity.badRequest().body("輸入模式不能為空");
        }

        InputMode inputMode = new InputMode();
        inputMode.setPartNumber(request.getPartNumber());
        inputMode.setInputMode(request.getInputMode());

        inputModeRepository.save(inputMode);

        return ResponseEntity.ok("輸入模式已成功創建");
    }

    // GET API
    @GetMapping("/get-input-modes")
    public ResponseEntity<List<InputMode>> getAllInputModes() {
        List<InputMode> inputModes = inputModeRepository.findAll();
        return ResponseEntity.ok(inputModes);
    }

    // SEARCH API 暫時不需要故先註解
    // @GetMapping("/search-input-modes")
    // public ResponseEntity<List<InputMode>> searchInputModes(
    //         @RequestParam(required = false) String partNumber,
    //         @RequestParam(required = false) String inputMode) {
    //     List<InputMode> inputModes = inputModeRepository.searchInputModes(partNumber, inputMode);
    //     return ResponseEntity.ok(inputModes);
    // }

    // EDIT PUT API
    @PutMapping("/put-input-modes/{id}")
    public ResponseEntity<?> updateInputMode(@PathVariable Long id, @RequestBody InputModeRequest request) {
        InputMode existingInputMode = inputModeRepository.findById(id)
                .orElse(null);

        if (existingInputMode == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.getPartNumber() == null || request.getPartNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("料號不能為空");
        }
        if (request.getInputMode() == null || request.getInputMode().isEmpty()) {
            return ResponseEntity.badRequest().body("輸入模式不能為空");
        }

        existingInputMode.setPartNumber(request.getPartNumber());
        existingInputMode.setInputMode(request.getInputMode());

        InputMode updatedInputMode = inputModeRepository.save(existingInputMode);

        return ResponseEntity.ok(updatedInputMode);
    }

    // DELETE API
    @DeleteMapping("/del-input-modes/{id}")
    public ResponseEntity<?> deleteInputMode(@PathVariable Long id) {
        InputMode existingInputMode = inputModeRepository.findById(id)
                .orElse(null);

        if (existingInputMode == null) {
            return ResponseEntity.notFound().build();
        }

        inputModeRepository.delete(existingInputMode);

        return ResponseEntity.ok("輸入模式已成功刪除");
    }
}

class InputModeRequest {
    private String partNumber;
    private String inputMode;

    // Getters
    public String getPartNumber() {
        return partNumber;
    }

    public String getInputMode() {
        return inputMode;
    }

    // Setters
    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public void setInputMode(String inputMode) {
        this.inputMode = inputMode;
    }
}