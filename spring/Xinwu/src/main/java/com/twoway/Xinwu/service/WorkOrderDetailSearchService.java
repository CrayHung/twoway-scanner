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
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

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

            if (criteria.getCreate_date() != null && !criteria.getCreate_date().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getCreate_date().stream()
                        .<Predicate>map(dateStr -> {
                            try {
                                LocalDate date = LocalDate.parse(dateStr);
                                return criteriaBuilder.equal(root.get("create_date"), date);
                            } catch (DateTimeParseException e) {
                                return criteriaBuilder.conjunction();
                            }
                        })
                        .toArray(Predicate[]::new)
                ));
            }

            if (criteria.getEdit_date() != null && !criteria.getEdit_date().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                    criteria.getEdit_date().stream()
                        .<Predicate>map(dateStr -> {
                            try {
                                LocalDate date = LocalDate.parse(dateStr);
                                return criteriaBuilder.equal(root.get("edit_date"), date);
                            } catch (DateTimeParseException e) {
                                return criteriaBuilder.conjunction();
                            }
                        })
                        .toArray(Predicate[]::new)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
    }
}