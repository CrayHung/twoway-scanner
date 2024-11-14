package com.twoway.Xinwu.service;

import com.twoway.Xinwu.entity.WorkOrderDetail;
import com.twoway.Xinwu.repository.WorkOrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.twoway.Xinwu.dto.WorkOrderDetailFuzzySearchDTO;
import com.twoway.Xinwu.dto.WorkOrderFieldSearchDTO;


import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
// import java.time.format.DateTimeParseException;


@Service
public class WorkOrderDetailSearchService {

    @Autowired
    private WorkOrderDetailRepository workOrderDetailRepository;

    // 全領域的空值檢查
    // **新增檢查List是否有效的輔助方法**
    private boolean isValidList(List<String> list) {
        return list != null && !list.isEmpty() && !list.stream().allMatch(String::isEmpty);
    }

    // **新增檢查日期列表是否有效的方法**
    private boolean isValidDateList(List<LocalDate> list) {
        return list != null && !list.isEmpty();
    }

    public List<WorkOrderDetail> fuzzySearch(WorkOrderDetailFuzzySearchDTO criteria) {
         // **DTO空值檢查邏輯**
        if (isEmptySearchCriteria(criteria)) {
            System.out.println("未輸入任何有效搜尋條件，返回空列表");
            return new ArrayList<>();
        }

        Specification<WorkOrderDetail> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // WorkOrderNumber
            if (isValidList(criteria.getWorkOrderNumber())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getWorkOrderNumber().stream()
                        .filter(won -> won != null && !won.trim().isEmpty())
                        .map(won -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("workOrderNumber")), "%" + won.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
  
            // Sn
            if (isValidList(criteria.getSn())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getSn().stream()
                        .filter(sn -> sn != null && !sn.trim().isEmpty())
                        .map(sn -> criteriaBuilder.like(criteriaBuilder.lower(root.get("sn")), "%" + sn.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            // QrRfTray
        if (isValidList(criteria.getQrRfTray())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrRfTray().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrRfTray")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrPs
        if (isValidList(criteria.getQrPs())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrPs().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrPs")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrHs
        if (isValidList(criteria.getQrHs())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrHs().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrHs")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrBackup1
        if (isValidList(criteria.getQrBackup1())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrBackup1().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup1")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrBackup2
        if (isValidList(criteria.getQrBackup2())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrBackup2().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup2")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrBackup3
        if (isValidList(criteria.getQrBackup3())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrBackup3().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup3")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrBackup4
        if (isValidList(criteria.getQrBackup4())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrBackup4().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup4")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Note
        if (isValidList(criteria.getNote())) {
            predicates.add(criteriaBuilder.or(
                criteria.getNote().stream()
                    .filter(note -> note != null && !note.trim().isEmpty())
                    .map(note -> criteriaBuilder.like(criteriaBuilder.lower(root.get("note")), "%" + note.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // PartNumber
        if (isValidList(criteria.getPartNumber())) {
            predicates.add(criteriaBuilder.or(
                criteria.getPartNumber().stream()
                    .filter(pn -> pn != null && !pn.trim().isEmpty())
                    .map(pn -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("partNumber")), "%" + pn.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Company
        if (isValidList(criteria.getCompany())) {
            predicates.add(criteriaBuilder.or(
                criteria.getCompany().stream()
                    .filter(c -> c != null && !c.trim().isEmpty())
                    .map(c -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("company")), "%" + c.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Create User
        if (isValidList(criteria.getCreate_user())) {
            predicates.add(criteriaBuilder.or(
                criteria.getCreate_user().stream()
                    .filter(user -> user != null && !user.trim().isEmpty())
                    .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("create_user")), "%" + user.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Edit User
        if (isValidList(criteria.getEdit_user())) {
            predicates.add(criteriaBuilder.or(
                criteria.getEdit_user().stream()
                    .filter(user -> user != null && !user.trim().isEmpty())
                    .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("edit_user")), "%" + user.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Production Date Start
        if (isValidDateList(criteria.getProductionDateStart())) {
            predicates.add(criteriaBuilder.or(
                criteria.getProductionDateStart().stream()
                    .map(date -> criteriaBuilder.greaterThanOrEqualTo(root.get("create_date"), date))
                    .toArray(Predicate[]::new)
            ));
        }

        // Production Date End
        if (isValidDateList(criteria.getProductionDateEnd())) {
            predicates.add(criteriaBuilder.or(
                criteria.getProductionDateEnd().stream()
                    .map(date -> criteriaBuilder.lessThanOrEqualTo(root.get("create_date"), date))
                    .toArray(Predicate[]::new)
            ));
        }

        // 新增 BEDID 字段的搜索條件
        if (isValidList(criteria.getQrRfTrayBedid())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrRfTrayBedid().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrRfTrayBedid")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        if (isValidList(criteria.getQrPsBedid())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrPsBedid().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrPsBedid")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        if (isValidList(criteria.getQrHsBedid())) {
            predicates.add(criteriaBuilder.or(
                criteria.getQrHsBedid().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrHsBedid")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // **執行搜尋並檢查結果**
        List<WorkOrderDetail> results = workOrderDetailRepository.findAll(spec);
        if (results.isEmpty()) {
            System.out.println("搜尋條件無符合項目");
        }
        return results;
    }

    // **新增檢查搜尋條件是否為空的方法**
    private boolean isEmptySearchCriteria(WorkOrderDetailFuzzySearchDTO criteria) {
        return !isValidList(criteria.getSn()) &&
               !isValidList(criteria.getQrRfTray()) &&
               !isValidList(criteria.getQrPs()) &&
               !isValidList(criteria.getQrHs()) &&
               !isValidList(criteria.getQrRfTrayBedid()) && // 新增BEDID*3
               !isValidList(criteria.getQrPsBedid()) &&     
               !isValidList(criteria.getQrHsBedid()) &&     
               !isValidList(criteria.getQrBackup1()) &&
               !isValidList(criteria.getQrBackup2()) &&
               !isValidList(criteria.getQrBackup3()) &&
               !isValidList(criteria.getQrBackup4()) &&
               !isValidList(criteria.getNote()) &&
               !isValidList(criteria.getWorkOrderNumber()) &&
               !isValidList(criteria.getPartNumber()) &&
               !isValidList(criteria.getCompany()) &&
               !isValidList(criteria.getCreate_user()) &&
               !isValidList(criteria.getEdit_user()) &&
               !isValidDateList(criteria.getProductionDateStart()) &&
               !isValidDateList(criteria.getProductionDateEnd());
    }





    // SN範圍搜尋

    public List<WorkOrderDetail> searchWorkOrderDetails(WorkOrderFieldSearchDTO request) {

        // **DTO空值檢查**
            if (isEmptyFieldSearchCriteria(request)) {
                System.out.println("未輸入任何有效搜尋條件，返回空列表");
                return new ArrayList<>();
            }


            Specification<WorkOrderDetail> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

        // WorkOrderNumber
        if (isValidList(request.getWorkOrderNumber())) {
            predicates.add(criteriaBuilder.or(
                request.getWorkOrderNumber().stream()
                    .filter(won -> won != null && !won.trim().isEmpty())
                    .map(won -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("workOrderNumber")), "%" + won.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // SnStart
        if (isValidList(request.getSnStart())) {
            predicates.add(criteriaBuilder.or(
                request.getSnStart().stream()
                    .filter(sn -> sn != null && !sn.trim().isEmpty())
                    .map(snStart -> criteriaBuilder.greaterThanOrEqualTo(root.get("sn"), snStart))
                    .toArray(Predicate[]::new)
            ));
        }

        // SnEnd
        if (isValidList(request.getSnEnd())) {
            predicates.add(criteriaBuilder.or(
                request.getSnEnd().stream()
                    .filter(sn -> sn != null && !sn.trim().isEmpty())
                    .map(snEnd -> criteriaBuilder.lessThanOrEqualTo(root.get("sn"), snEnd))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrRFTray
        if (isValidList(request.getQrRFTray())) {
            predicates.add(criteriaBuilder.or(
                request.getQrRFTray().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrRfTray")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrPS
        if (isValidList(request.getQrPS())) {
            predicates.add(criteriaBuilder.or(
                request.getQrPS().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrPs")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrHS
        if (isValidList(request.getQrHS())) {
            predicates.add(criteriaBuilder.or(
                request.getQrHS().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrHs")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrBackup1
        if (isValidList(request.getQrBackup1())) {
            predicates.add(criteriaBuilder.or(
                request.getQrBackup1().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup1")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrBackup2
        if (isValidList(request.getQrBackup2())) {
            predicates.add(criteriaBuilder.or(
                request.getQrBackup2().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup2")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrBackup3
        if (isValidList(request.getQrBackup3())) {
            predicates.add(criteriaBuilder.or(
                request.getQrBackup3().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup3")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // QrBackup4
        if (isValidList(request.getQrBackup4())) {
            predicates.add(criteriaBuilder.or(
                request.getQrBackup4().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup4")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Note
        if (isValidList(request.getNote())) {
            predicates.add(criteriaBuilder.or(
                request.getNote().stream()
                    .filter(note -> note != null && !note.trim().isEmpty())
                    .map(note -> criteriaBuilder.like(criteriaBuilder.lower(root.get("note")), "%" + note.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Create User
        if (isValidList(request.getCreate_user())) {
            predicates.add(criteriaBuilder.or(
                request.getCreate_user().stream()
                    .filter(user -> user != null && !user.trim().isEmpty())
                    .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("create_user")), "%" + user.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Edit User
        if (isValidList(request.getEdit_user())) {
            predicates.add(criteriaBuilder.or(
                request.getEdit_user().stream()
                    .filter(user -> user != null && !user.trim().isEmpty())
                    .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("edit_user")), "%" + user.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Detail ID
        if (isValidList(request.getDetail_id())) {
            predicates.add(criteriaBuilder.or(
                request.getDetail_id().stream()
                    .filter(id -> id != null && !id.trim().isEmpty())
                    .map(id -> criteriaBuilder.like(root.get("detail_id").as(String.class), "%" + id + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // PartNumber
        if (isValidList(request.getPartNumber())) {
            predicates.add(criteriaBuilder.or(
                request.getPartNumber().stream()
                    .filter(pn -> pn != null && !pn.trim().isEmpty())
                    .map(pn -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("partNumber")), "%" + pn.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Company
        if (isValidList(request.getCompany())) {
            predicates.add(criteriaBuilder.or(
                request.getCompany().stream()
                    .filter(c -> c != null && !c.trim().isEmpty())
                    .map(c -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("company")), "%" + c.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Quantity
        if (isValidList(request.getQuantity())) {
            predicates.add(criteriaBuilder.or(
                request.getQuantity().stream()
                    .filter(q -> q != null && !q.trim().isEmpty())
                    .map(q -> criteriaBuilder.like(root.get("workOrder").get("quantity").as(String.class), "%" + q + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        // Production Date Start
        if (isValidDateList(request.getProductionDateStart())) {
            predicates.add(criteriaBuilder.or(
                request.getProductionDateStart().stream()
                    .map(date -> criteriaBuilder.greaterThanOrEqualTo(root.get("create_date"), date))
                    .toArray(Predicate[]::new)
            ));
        }

        // Production Date End
        if (isValidDateList(request.getProductionDateEnd())) {
            predicates.add(criteriaBuilder.or(
                request.getProductionDateEnd().stream()
                    .map(date -> criteriaBuilder.lessThanOrEqualTo(root.get("create_date"), date))
                    .toArray(Predicate[]::new)
            ));
        }

         // 新增 BEDID 字段的搜索條件
         if (isValidList(request.getQrRFTrayBedid())) {
            predicates.add(criteriaBuilder.or(
                request.getQrRFTrayBedid().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrRfTrayBedid")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        if (isValidList(request.getQrPSBedid())) {
            predicates.add(criteriaBuilder.or(
                request.getQrPSBedid().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrPsBedid")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }

        if (isValidList(request.getQrHSBedid())) {
            predicates.add(criteriaBuilder.or(
                request.getQrHSBedid().stream()
                    .filter(qr -> qr != null && !qr.trim().isEmpty())
                    .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrHsBedid")), "%" + qr.toLowerCase() + "%"))
                    .toArray(Predicate[]::new)
            ));
        }


            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // **執行搜尋並檢查結果**
            List<WorkOrderDetail> results = workOrderDetailRepository.findAll(spec);
            if (results.isEmpty()) {
                System.out.println("搜尋條件無符合項目");
            }
            return results;
    }

    // **SN 範圍搜尋 的空值檢查方法**
    private boolean isEmptyFieldSearchCriteria(WorkOrderFieldSearchDTO request) {
    return !isValidList(request.getWorkOrderNumber()) &&
           !isValidList(request.getSnStart()) &&
           !isValidList(request.getSnEnd()) &&
           !isValidList(request.getQrRFTray()) &&
           !isValidList(request.getQrPS()) &&
           !isValidList(request.getQrHS()) &&
           !isValidList(request.getQrRFTrayBedid()) && // 新增 BEDID
           !isValidList(request.getQrPSBedid()) &&     
           !isValidList(request.getQrHSBedid()) &&     
           !isValidList(request.getQrBackup1()) &&
           !isValidList(request.getQrBackup2()) &&
           !isValidList(request.getQrBackup3()) &&
           !isValidList(request.getQrBackup4()) &&
           !isValidList(request.getNote()) &&
           !isValidList(request.getCreate_user()) &&
           !isValidList(request.getEdit_user()) &&
           !isValidList(request.getDetail_id()) &&
           !isValidList(request.getPartNumber()) &&
           !isValidList(request.getCompany()) &&
           !isValidList(request.getQuantity()) &&
           !isValidDateList(request.getProductionDateStart()) &&
           !isValidDateList(request.getProductionDateEnd());
}
}