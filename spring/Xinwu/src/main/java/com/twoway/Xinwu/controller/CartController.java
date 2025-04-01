package com.twoway.Xinwu.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

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
import com.twoway.Xinwu.entity.Shipped;
import com.twoway.Xinwu.entity.ShippedRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ShippedRepository shippedRepository;

    // 加入購物車
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody Cart cart) {
        cart.setAddedTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        Cart savedCart = cartRepository.save(cart);
        return ResponseEntity.ok(savedCart);
    }

    // 取得購物車內容
    @GetMapping("/items")
    public ResponseEntity<List<Cart>> getCartItems() {
        List<Cart> cartItems = cartRepository.findAll();
        return ResponseEntity.ok(cartItems);
    }

    // 移除購物車內的單一項目
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Integer id) {
        cartRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // 確認出貨 (將購物車內容轉移到 shipped，然後清空購物車)
    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<Void> checkout() {
        List<Cart> cartItems = cartRepository.findAll();
        List<Shipped> shippedItems = new ArrayList<>();

        for (Cart cartItem : cartItems) {
            Shipped shipped = new Shipped();
            shipped.setPalletName(cartItem.getPalletName());
            shipped.setCartonName(cartItem.getCartonName());
            shipped.setSn(cartItem.getSn());
            shipped.setQrRftray(cartItem.getQrRftray());
            shipped.setQrPs(cartItem.getQrPs());
            shipped.setQrHs(cartItem.getQrHs());
            shipped.setQrRftrayBedid(cartItem.getQrRftrayBedid());
            shipped.setQrPsBedid(cartItem.getQrPsBedid());
            shipped.setQrHsBedid(cartItem.getQrHsBedid());
            shipped.setShippedTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));


            shippedItems.add(shipped);
        }

        // 存入 shipped 表
        shippedRepository.saveAll(shippedItems);

        // 清空購物車
        cartRepository.deleteAll();

        return ResponseEntity.ok().build();
    }
}
