package com.twoway.Xinwu.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.twoway.Xinwu.entity.Cart;
import com.twoway.Xinwu.entity.CartRepository;
import com.twoway.Xinwu.entity.PalletRepository;
import com.twoway.Xinwu.entity.Shipped;
import com.twoway.Xinwu.entity.ShippedRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api")
public class CartController {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ShippedRepository shippedRepository;

    @Autowired
    private PalletRepository palletRepository;

    // 加入購物車
    @PostMapping("/cart/add")
    public ResponseEntity<?> addToCart(@RequestBody List<Cart> cart) {
        if (cart == null || cart.isEmpty()) {
            System.out.println("cart is empty");
            return ResponseEntity.badRequest().body("Error: No cart data provided.");
        }

        try {
            List<Cart> savedCart = cartRepository.saveAll(cart);
            System.out.println("cart : " + savedCart);
            return ResponseEntity.ok(savedCart);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving cart data: " + e.getMessage());
        }
    }

    // 取得購物車內容
    @GetMapping("/cart/items")
    public ResponseEntity<List<Cart>> getCartItems() {
        List<Cart> cartItems = cartRepository.findAll();
        return ResponseEntity.ok(cartItems);
    }

    // 移除購物車內的單一項目
    @DeleteMapping("/cart/remove/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Integer id) {
        cartRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // 確認出貨 (將接收的資料內容轉移到 shipped表，然後將那些資料移出購物車)
    @PostMapping("/cart/checkout")
    @Transactional
    public ResponseEntity<Void> checkout(@RequestBody List<Cart> itemsToShip) {
        List<Shipped> shippedItems = new ArrayList<>();
        List<Integer> idsToDelete = new ArrayList<>();

        for (Cart item : itemsToShip) {

            List<Cart> matchingCartItems = cartRepository.findBySn(item.getSn());
            for (Cart cartItem : matchingCartItems) {
                Shipped shipped = new Shipped();
                shipped.setPalletName(cartItem.getPalletName());
                shipped.setCartonName(cartItem.getCartonName());
                shipped.setSn(cartItem.getSn());
                shipped.setQrRftray(cartItem.getQrRfTray());
                shipped.setQrPs(cartItem.getQrPs());
                shipped.setQrHs(cartItem.getQrHs());
                shipped.setQrRftrayBedid(cartItem.getQrRfTrayBedid());
                shipped.setQrPsBedid(cartItem.getQrPsBedid());
                shipped.setQrHsBedid(cartItem.getQrHsBedid());
                shipped.setShippedTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

                shippedItems.add(shipped);
                idsToDelete.add(cartItem.getId());
            }
        }

        shippedRepository.saveAll(shippedItems);

        if (!idsToDelete.isEmpty()) {
            cartRepository.deleteAllById(idsToDelete);
        }

        return ResponseEntity.ok().build();
    }

    // 取得多個palletNames內的cart資料
    @PostMapping("/cart/by-pallet-names")
    public ResponseEntity<?> getCartByPalletNames(@RequestBody Map<String, List<String>> request) {
        List<String> palletNames = request.get("palletNames");

        if (palletNames == null || palletNames.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No pallet names provided.");
        }

        List<Cart> cart = cartRepository.findByPalletNames(palletNames);
        return ResponseEntity.ok(cart);
    }

    // 取得多個pallet內ID的cart資料
    @PostMapping("/cart/by-pallet-ID")
    public ResponseEntity<?> getCartByPalletID(@RequestBody Map<String, List<Integer>> request) {
        List<Integer> palletID = request.get("ids");

        if (palletID == null || palletID.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No pallet id provided.");
        }

        List<Cart> cart = cartRepository.findByPalletID(palletID);
        return ResponseEntity.ok(cart);
    }

}
