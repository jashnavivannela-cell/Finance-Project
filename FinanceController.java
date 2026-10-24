package com.apex.finance.controller;

import com.apex.finance.model.Goal;
import com.apex.finance.model.Transaction;
import com.apex.finance.service.FinanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(financeService.getFinancialSummary());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getTransactions() {
        return ResponseEntity.ok(financeService.getAllTransactions());
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction created = financeService.addTransaction(transaction);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable String id, @RequestBody Transaction transaction) {
        Transaction updated = financeService.updateTransaction(id, transaction);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteTransaction(@PathVariable String id) {
        boolean deleted = financeService.deleteTransaction(id);
        return ResponseEntity.ok(Map.of("success", deleted));
    }

    @GetMapping("/goals")
    public ResponseEntity<List<Goal>> getGoals() {
        return ResponseEntity.ok(financeService.getAllGoals());
    }

    @PostMapping("/goals")
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
        return ResponseEntity.ok(financeService.addGoal(goal));
    }

    @GetMapping("/budgets")
    public ResponseEntity<Map<String, BigDecimal>> getBudgets() {
        return ResponseEntity.ok(financeService.getBudgets());
    }

    @PostMapping("/budgets")
    public ResponseEntity<Map<String, String>> setBudget(@RequestBody Map<String, Object> body) {
        String category = (String) body.get("category");
        BigDecimal limit = new BigDecimal(body.get("limit").toString());
        financeService.setBudget(category, limit);
        return ResponseEntity.ok(Map.of("status", "updated"));
    }
}
