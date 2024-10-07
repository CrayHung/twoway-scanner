package com.twoway.Xinwu.service;

import com.twoway.Xinwu.entity.WorkOrderDetail;
import com.twoway.Xinwu.repository.WorkOrderDetailDTO;
import com.twoway.Xinwu.repository.WorkOrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Service
public class WorkOrderDetailSearchService {

    @Autowired
    private WorkOrderDetailRepository workOrderDetailRepository;

    public List<WorkOrderDetail> fuzzySearch(WorkOrderDetailDTO criteria) {
        return workOrderDetailRepository.findAll((Specification<WorkOrderDetail>) (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getSn() != null && !criteria.getSn().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getSn().stream()
                        .map(sn -> criteriaBuilder.like(criteriaBuilder.lower(root.get("sn")), "%" + sn.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQR_RFTray() != null && !criteria.getQR_RFTray().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQR_RFTray().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("QR_RFTray")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQR_PS() != null && !criteria.getQR_PS().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQR_PS().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("QR_PS")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQR_HS() != null && !criteria.getQR_HS().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQR_HS().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("QR_HS")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQR_backup1() != null && !criteria.getQR_backup1().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQR_backup1().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("QR_backup1")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQR_backup2() != null && !criteria.getQR_backup2().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQR_backup2().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("QR_backup2")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQR_backup3() != null && !criteria.getQR_backup3().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQR_backup3().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("QR_backup3")), "%" + qr.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getQR_backup4() != null && !criteria.getQR_backup4().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQR_backup4().stream()
                        .map(qr -> criteriaBuilder.like(criteriaBuilder.lower(root.get("QR_backup4")), "%" + qr.toLowerCase() + "%"))
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

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}