"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, subtotal } =
    useCart();
  const total = subtotal();
  const shipping = total > 1000 || total === 0 ? 0 : 120;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-surface/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
                <ShoppingBag className="h-5 w-5 text-brand-secondary" />
                Your Cart
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5">
                  <ShoppingBag className="h-8 w-8 text-muted" />
                </div>
                <p className="text-muted">Your cart is empty.</p>
                <Button onClick={() => setOpen(false)} variant="outline">
                  Continue shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-black/40">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold leading-tight">
                            {item.name}
                          </p>
                          <button
                            onClick={() => removeItem(item.productId)}
                            aria-label="Remove item"
                            className="text-muted hover:text-brand-secondary"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-white/10">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-brand-accent">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-white/10 p-6">
                  <div className="flex justify-between text-sm text-muted">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted">
                    <span>Shipping</span>
                    <span className="text-white">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-4 font-heading text-lg font-bold">
                    <span>Total</span>
                    <span className="text-gradient">
                      {formatPrice(total + shipping)}
                    </span>
                  </div>
                  <Button asChild size="lg" className="w-full">
                    <Link href="/checkout" onClick={() => setOpen(false)}>
                      Checkout
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
