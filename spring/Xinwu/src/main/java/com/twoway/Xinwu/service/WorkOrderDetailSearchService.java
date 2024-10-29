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
// import java.time.LocalDate;
// import java.time.format.DateTimeParseException;

@Service
public class WorkOrderDetailSearchService {

    @Autowired
    private WorkOrderDetailRepository workOrderDetailRepository;

    public List<WorkOrderDetail> fuzzySearch(WorkOrderDetailFuzzySearchDTO criteria) {
        return workOrderDetailRepository.findAll((Specification<WorkOrderDetail>) (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getSn() != null && !criteria.getSn().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getSn().stream()
                        .map(sn -> criteriaBuilder.like(criteriaBuilder.lower(root.get("sn")), "%" + sn.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQrRfTray() != null && !criteria.getQrRfTray().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQrRfTray().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrRfTray")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQrPs() != null && !criteria.getQrPs().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQrPs().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrPs")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQrHs() != null && !criteria.getQrHs().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQrHs().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrHs")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQrBackup1() != null && !criteria.getQrBackup1().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQrBackup1().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup1")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQrBackup2() != null && !criteria.getQrBackup2().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQrBackup2().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup2")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQrBackup3() != null && !criteria.getQrBackup3().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQrBackup3().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup3")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQrBackup4() != null && !criteria.getQrBackup4().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQrBackup4().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup4")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getNote() != null && !criteria.getNote().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getNote().stream()
                        .map(note -> criteriaBuilder.like(criteriaBuilder.lower(root.get("note")), "%" + note.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getWorkOrderNumber() != null && !criteria.getWorkOrderNumber().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getWorkOrderNumber().stream()
                        .map(won -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("workOrderNumber")), "%" + won.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getPartNumber() != null && !criteria.getPartNumber().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getPartNumber().stream()
                        .map(pn -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("partNumber")), "%" + pn.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getCompany() != null && !criteria.getCompany().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getCompany().stream()
                        .map(c -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("company")), "%" + c.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getCreate_user() != null && !criteria.getCreate_user().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getCreate_user().stream()
                        .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("create_user")), "%" + user.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            
            if (criteria.getEdit_user() != null && !criteria.getEdit_user().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getEdit_user().stream()
                        .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("edit_user")), "%" + user.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

             // 日期範圍搜尋邏輯
             if (criteria.getProductionDateStart() != null && !criteria.getProductionDateStart().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getProductionDateStart().stream()
                        .map(date -> criteriaBuilder.greaterThanOrEqualTo(root.get("create_date"), date))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getProductionDateEnd() != null && !criteria.getProductionDateEnd().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getProductionDateEnd().stream()
                        .map(date -> criteriaBuilder.lessThanOrEqualTo(root.get("create_date"), date))
                        .toArray(Predicate[]::new)
                ));
            }


            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }

    // SN範圍搜尋

    public List<WorkOrderDetail> searchWorkOrderDetails(WorkOrderFieldSearchDTO request) {
        return workOrderDetailRepository.findAll((Specification<WorkOrderDetail>) (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.getWorkOrderNumber() != null && !request.getWorkOrderNumber().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getWorkOrderNumber().stream()
                        .map(won -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("workOrderNumber")), "%" + won.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (request.getSnStart() != null && !request.getSnStart().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getSnStart().stream()
                        .map(snStart -> criteriaBuilder.greaterThanOrEqualTo(root.get("sn"), snStart))
                        .toArray(Predicate[]::new)
                ));
            }

            if (request.getSnEnd() != null && !request.getSnEnd().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getSnEnd().stream()
                        .map(snEnd -> criteriaBuilder.lessThanOrEqualTo(root.get("sn"), snEnd))
                        .toArray(Predicate[]::new)
                ));
            }

            if (request.getQrRFTray() != null && !request.getQrRFTray().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getQrRFTray().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrRfTray")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getQrPS() != null && !request.getQrPS().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getQrPS().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrPs")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getQrHS() != null && !request.getQrHS().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getQrHS().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrHs")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getQrBackup1() != null && !request.getQrBackup1().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getQrBackup1().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup1")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getQrBackup2() != null && !request.getQrBackup2().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getQrBackup2().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup2")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getQrBackup3() != null && !request.getQrBackup3().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getQrBackup3().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup3")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getQrBackup4() != null && !request.getQrBackup4().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getQrBackup4().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("qrBackup4")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            // 添加 productionDateStart 邏輯
            if (request.getProductionDateStart() != null && !request.getProductionDateStart().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getProductionDateStart().stream()
                        .map(date -> criteriaBuilder.greaterThanOrEqualTo(root.get("create_date"), date))
                        .toArray(Predicate[]::new)
                ));
            }

            // 添加 productionDateEnd 邏輯
            if (request.getProductionDateEnd() != null && !request.getProductionDateEnd().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getProductionDateEnd().stream()
                        .map(date -> criteriaBuilder.lessThanOrEqualTo(root.get("create_date"), date))
                        .toArray(Predicate[]::new)
                ));
            }

            

            if (request.getNote() != null && !request.getNote().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getNote().stream()
                        .map(note -> criteriaBuilder.like(criteriaBuilder.lower(root.get("note")), "%" + note.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getCreate_user() != null && !request.getCreate_user().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getCreate_user().stream()
                        .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("create_user")), "%" + user.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getEdit_user() != null && !request.getEdit_user().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getEdit_user().stream()
                        .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("edit_user")), "%" + user.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getDetail_id() != null && !request.getDetail_id().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getDetail_id().stream()
                        .map(id -> criteriaBuilder.like(root.get("detail_id").as(String.class), "%" + id + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getPartNumber() != null && !request.getPartNumber().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getPartNumber().stream()
                        .map(pn -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("partNumber")), "%" + pn.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getCompany() != null && !request.getCompany().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getCompany().stream()
                        .map(c -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrder").get("company")), "%" + c.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }
    
            if (request.getQuantity() != null && !request.getQuantity().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    request.getQuantity().stream()
                        .map(q -> criteriaBuilder.like(root.get("workOrder").get("quantity").as(String.class), "%" + q + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}