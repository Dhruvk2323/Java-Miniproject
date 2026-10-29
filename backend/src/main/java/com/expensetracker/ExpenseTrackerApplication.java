package com.expensetracker;

import com.expensetracker.model.Category;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class ExpenseTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpenseTrackerApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepo,
                                  UserRepository userRepo,
                                  ExpenseRepository expenseRepo) {
        return args -> {
            // Seed default user if not present
            User defaultUser = userRepo.findByUsername("demo_user").orElseGet(() -> {
                User u = new User();
                u.setUsername("demo_user");
                u.setEmail("karan@example.com");
                u.setFullName("Karan Student");
                u.setMonthlyBudget(30000.0);
                u.setCreatedAt(LocalDateTime.now());
                return userRepo.save(u);
            });

            // Seed default categories if table is empty
            if (categoryRepo.count() == 0) {
                Category c1 = categoryRepo.save(new Category("Food & Dining", 6000.0, "#F59E0B", "Utensils"));
                Category c2 = categoryRepo.save(new Category("Transportation", 3500.0, "#3B82F6", "Car"));
                Category c3 = categoryRepo.save(new Category("Shopping", 5000.0, "#EC4899", "ShoppingBag"));
                Category c4 = categoryRepo.save(new Category("Bills & Utilities", 4000.0, "#8B5CF6", "FileText"));
                Category c5 = categoryRepo.save(new Category("Entertainment", 3000.0, "#10B981", "Film"));
                Category c6 = categoryRepo.save(new Category("Health & Fitness", 2500.0, "#EF4444", "HeartPulse"));
                Category c7 = categoryRepo.save(new Category("Education", 4000.0, "#06B6D4", "GraduationCap"));
                Category c8 = categoryRepo.save(new Category("Miscellaneous", 2000.0, "#6B7280", "Folder"));

                // Seed realistic sample expenses
                LocalDate today = LocalDate.now();
                expenseRepo.saveAll(List.of(
                    new Expense("Grocery Shopping at DMart", 2450.0, c1, defaultUser, today.minusDays(1), "UPI", "Monthly household rations and snacks", LocalDateTime.now()),
                    new Expense("Petrol Fill-up", 1200.0, c2, defaultUser, today.minusDays(2), "Credit Card", "Full tank for bike", LocalDateTime.now()),
                    new Expense("Electricity Bill Payment", 1850.0, c4, defaultUser, today.minusDays(4), "Net Banking", "Mahavitaran electricity bill", LocalDateTime.now()),
                    new Expense("Cinema Tickets - IMAX", 750.0, c5, defaultUser, today.minusDays(5), "UPI", "Weekend movie with college friends", LocalDateTime.now()),
                    new Expense("Java & Spring Boot Reference Books", 1400.0, c7, defaultUser, today.minusDays(7), "Debit Card", "Lab manual and text books", LocalDateTime.now()),
                    new Expense("Dinner with Group", 1820.0, c1, defaultUser, today.minusDays(9), "UPI", "Restaurant dinner celebration", LocalDateTime.now()),
                    new Expense("Gym Membership Monthly", 1500.0, c6, defaultUser, today.minusDays(12), "UPI", "Monthly fitness subscription", LocalDateTime.now()),
                    new Expense("New Wireless Earbuds", 2299.0, c3, defaultUser, today.minusDays(15), "Credit Card", "Amazon Great Indian Festival sale", LocalDateTime.now()),
                    new Expense("Wi-Fi Broadband Recharge", 899.0, c4, defaultUser, today.minusDays(18), "UPI", "JioFiber monthly plan", LocalDateTime.now()),
                    new Expense("Metro Card Smart Recharge", 500.0, c2, defaultUser, today.minusDays(21), "Cash", "Monthly commute card recharge", LocalDateTime.now())
                ));
            }
        };
    }
}
