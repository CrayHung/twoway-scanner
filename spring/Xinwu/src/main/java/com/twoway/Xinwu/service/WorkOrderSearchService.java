package com.twoway.Xinwu.service;

import com.twoway.Xinwu.dto.WorkOrderDTO;
import com.twoway.Xinwu.dto.WorkOrderSearchDTO;
import com.twoway.Xinwu.entity.WorkOrder;
import com.twoway.Xinwu.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class WorkOrderSearchService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    private boolean isValidList(List<String> list) {
        return list != null && !list.isEmpty() && !list.stream().allMatch(String::isEmpty);
    }

    private boolean isValidDateList(List<LocalDate> list) {
        return list != null && !list.isEmpty();
    }

    public List<WorkOrderDTO> fuzzySearch(WorkOrderSearchDTO criteria) {
        if (isEmptySearchCriteria(criteria)) {
            System.out.println("未輸入任何有效搜尋條件，返回空列表");
            return new ArrayList<>();
        }

        Specification<WorkOrder> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // WorkOrderNumber
            if (isValidList(criteria.getWorkOrderNumber())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getWorkOrderNumber().stream()
                        .filter(won -> won != null && !won.trim().isEmpty())
                        .map(won -> criteriaBuilder.like(criteriaBuilder.lower(root.get("workOrderNumber")), "%" + won.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            // PartNumber
            if (isValidList(criteria.getPartNumber())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getPartNumber().stream()
                        .filter(pn -> pn != null && !pn.trim().isEmpty())
                        .map(pn -> criteriaBuilder.like(criteriaBuilder.lower(root.get("partNumber")), "%" + pn.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            // Company
            if (isValidList(criteria.getCompany())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getCompany().stream()
                        .filter(c -> c != null && !c.trim().isEmpty())
                        .map(c -> criteriaBuilder.like(criteriaBuilder.lower(root.get("company")), "%" + c.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            // Quantity
            if (isValidList(criteria.getQuantity())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getQuantity().stream()
                        .filter(q -> q != null && !q.trim().isEmpty())
                        .map(q -> criteriaBuilder.like(root.get("quantity").as(String.class), "%" + q + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            // CreateUser
            if (isValidList(criteria.getCreateUser())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getCreateUser().stream()
                        .filter(user -> user != null && !user.trim().isEmpty())
                        .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("createUser")), "%" + user.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            // EditUser
            if (isValidList(criteria.getEditUser())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getEditUser().stream()
                        .filter(user -> user != null && !user.trim().isEmpty())
                        .map(user -> criteriaBuilder.like(criteriaBuilder.lower(root.get("editUser")), "%" + user.toLowerCase() + "%"))
                        .toArray(Predicate[]::new)
                ));
            }

            // CreateDateStart
            if (isValidDateList(criteria.getCreateDateStart())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getCreateDateStart().stream()
                        .map(date -> criteriaBuilder.greaterThanOrEqualTo(root.get("createDate"), date))
                        .toArray(Predicate[]::new)
                ));
            }

            // CreateDateEnd
            if (isValidDateList(criteria.getCreateDateEnd())) {
                predicates.add(criteriaBuilder.or(
                    criteria.getCreateDateEnd().stream()
                        .map(date -> criteriaBuilder.lessThanOrEqualTo(root.get("createDate"), date))
                        .toArray(Predicate[]::new)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

         List<WorkOrder> results = workOrderRepository.findAll(spec);
        if (results.isEmpty()) {
            System.out.println("搜尋條件無符合項目");
        }
        
        return results.stream()
                .map(WorkOrderDTO::fromEntity)
                .collect(Collectors.toList());
    }
    

    private boolean isEmptySearchCriteria(WorkOrderSearchDTO criteria) {
        return !isValidList(criteria.getWorkOrderNumber()) &&
               !isValidList(criteria.getPartNumber()) &&
               !isValidList(criteria.getCompany()) &&
               !isValidList(criteria.getQuantity()) &&
               !isValidList(criteria.getCreateUser()) &&
               !isValidList(criteria.getEditUser()) &&
               !isValidDateList(criteria.getCreateDateStart()) &&
               !isValidDateList(criteria.getCreateDateEnd());
    }
}