package com.twoway.Xinwu.repository;

// import com.twoway.Xinwu.entity.WorkOrderDetail;
// import com.twoway.Xinwu.entity.WorkOrder;
// import org.springframework.data.jpa.domain.Specification;

// import jakarta.persistence.criteria.*;
// import jakarta.persistence.criteria.Root;
// import java.util.ArrayList;
// import java.util.List;
// import java.time.LocalDate;

public class WorkOrderDetailSpecification {

    // public static Specification<WorkOrderDetail> advancedFieldFuzzySearch(WorkOrderDetailDTO dto) {
    //     return (root, query, criteriaBuilder) -> {
    //         List<Predicate> predicates = new ArrayList<>();

    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "sn", dto.getSN());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "qr_RFTray", dto.getQR_RFTray());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "qr_PS", dto.getQR_PS());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "qr_HS", dto.getQR_HS());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "qr_backup1", dto.getQR_backup1());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "qr_backup2", dto.getQR_backup2());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "qr_backup3", dto.getQR_backup3());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "qr_backup4", dto.getQR_backup4());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "note", dto.getNote());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "create_user", dto.getCreate_user());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "edit_user", dto.getEdit_user());
    //         addFuzzySearchPredicates(criteriaBuilder, root, predicates, "detail_id", dto.getDetail_id());
            
    //         // addDateRangePredicates(criteriaBuilder, root, predicates, "create_date", dto.getCreate_date());
    //         // addDateRangePredicates(criteriaBuilder, root, predicates, "edit_date", dto.getEdit_date());

    //         Join<WorkOrderDetail, WorkOrder> workOrderJoin = root.join("workOrder", JoinType.LEFT);
    //         addFuzzySearchPredicates(criteriaBuilder, workOrderJoin, predicates, "workOrderNumber", dto.getWorkOrderNumber());
    //         addFuzzySearchPredicates(criteriaBuilder, workOrderJoin, predicates, "partNumber", dto.getPartNumber());
    //         addFuzzySearchPredicates(criteriaBuilder, workOrderJoin, predicates, "company", dto.getCompany());
    //         addFuzzySearchPredicates(criteriaBuilder, workOrderJoin, predicates, "quantity", dto.getQuantity());

    //         return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    //     };
    // }

    // private static void addFuzzySearchPredicates(CriteriaBuilder cb, From<?, ?> root, List<Predicate> predicates, String fieldName, List<String> searchTerms) {
    //     if (searchTerms != null && !searchTerms.isEmpty()) {
    //         List<Predicate> fieldPredicates = new ArrayList<>();
    //         for (String term : searchTerms) {
    //             if (term != null && !term.trim().isEmpty()) {
    //                 fieldPredicates.add(cb.like(cb.lower(root.get(fieldName).as(String.class)), "%" + term.toLowerCase() + "%"));
    //             }
    //         }
    //         if (!fieldPredicates.isEmpty()) {
    //             predicates.add(cb.or(fieldPredicates.toArray(new Predicate[0])));
    //         }
    //     }
    // }

    // private static void addDateRangePredicates(CriteriaBuilder cb, From<?, ?> root, List<Predicate> predicates, String fieldName, List<String> dateRange) {
    //     if (dateRange != null && dateRange.size() == 2) {
    //         try {
    //             LocalDate startDate = LocalDate.parse(dateRange.get(0));
    //             LocalDate endDate = LocalDate.parse(dateRange.get(1));
    //             predicates.add(cb.between(root.get(fieldName), startDate, endDate));
    //         } catch (DateTimeParseException e) {
    //             // 處理日期解析錯誤
    //             System.err.println("日期解析錯誤: " + e.getMessage());
    //         }
    //     }
    // }
}