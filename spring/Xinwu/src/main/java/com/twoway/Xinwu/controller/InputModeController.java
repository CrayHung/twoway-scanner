package com.twoway.Xinwu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

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
        if (request.getNumberPerPallet() <= 0) {
            return ResponseEntity.badRequest().body("每棧板機台數不能為空");
        }
        /**根據ACI新增判斷 */
        if (request.getAciPartNumber() == null || request.getAciPartNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("ACI料號不能為空");
        }
 
        InputMode inputMode = new InputMode();
        inputMode.setPartNumber(request.getPartNumber());
        inputMode.setInputMode(request.getInputMode());
        inputMode.setNumberPerPallet(request.getNumberPerPallet());
        inputMode.setCreateUser(request.getCreateUser());
        inputMode.setCreateDate(LocalDate.now());
        inputMode.setAciPartNumber(request.getAciPartNumber());
        // inputMode.setCustomPartNumber(request.getCustomPartNumber());

        // 非必要欄位, 若為null則不更新
        if (request.getSummary() != null) {
            inputMode.setSummary(request.getSummary());
        }

        if (request.getNote() != null) {
            inputMode.setNote(request.getNote());
        }

        inputModeRepository.save(inputMode);

        return ResponseEntity.ok("料號已成功創建");
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
        if (request.getNumberPerPallet() <= 0) {
            return ResponseEntity.badRequest().body("每棧板機台數不能為空");
        }
       /**根據ACI新增判斷 */
       if (request.getAciPartNumber() == null || request.getAciPartNumber().isEmpty()) {
        return ResponseEntity.badRequest().body("ACI料號不能為空");
    }
    
        existingInputMode.setPartNumber(request.getPartNumber());
        existingInputMode.setInputMode(request.getInputMode());
        existingInputMode.setNumberPerPallet(request.getNumberPerPallet());
        existingInputMode.setEditUser(request.getEditUser());
        existingInputMode.setEditDate(LocalDate.now());

        existingInputMode.setAciPartNumber(request.getAciPartNumber());
        // existingInputMode.setCustomPartNumber(request.getCustomPartNumber());

        // 非必要欄位, 若為null則不更新
        if (request.getSummary() != null) {
            existingInputMode.setSummary(request.getSummary());
        }

        if (request.getNote() != null) {
            existingInputMode.setNote(request.getNote());
        } 

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

        return ResponseEntity.ok("料號已成功刪除");
    }
}

class InputModeRequest {
    private String partNumber;

    private String inputMode;

    private int numberPerPallet;

    private String summary;

    private String note;

    private String createUser;

    private String editUser;

    /**ACI */
    private String aciPartNumber;
    // private String customPartNumber;
    // public String getCustomPartNumber() {
    //     return customPartNumber;
    // }

    // public void setCustomPartNumber(String customPartNumber) {
    //     this.customPartNumber = customPartNumber;
    // }

    public String getAciPartNumber() {
        return aciPartNumber;
    }

    public void setAciPartNumber(String aciPartNumber) {
        this.aciPartNumber = aciPartNumber;
    }

    // Getters and Setters
    public String getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public String getInputMode() {
        return inputMode;
    }

    public void setInputMode(String inputMode) {
        this.inputMode = inputMode;
    }

    public int getNumberPerPallet() {
        return numberPerPallet;
    }

    public void setNumberPerPallet(int numberPerPallet) {
        this.numberPerPallet = numberPerPallet;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public String getEditUser() {
        return editUser;
    }

    public void setEditUser(String editUser) {
        this.editUser = editUser;
    }

}