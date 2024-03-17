module tokens::usdc {
  use std::option;

  use sui::transfer;
  use sui::object::{Self, UID};
  use sui::tx_context::TxContext;
  use sui::coin::{Self, Coin, TreasuryCap};

  // === Structs ===  

  struct USDC has drop {}

  struct CapWrapper has key {
    id: UID,
    cap: TreasuryCap<USDC>
  }
  // === Init ===  

  #[lint_allow(share_owned)]
  fun init(witness: USDC, ctx: &mut TxContext) {
      let (treasury, metadata) = coin::create_currency<USDC>(
            witness, 
            9, 
            b"USDC",
            b"USDC Stabil", 
            b"Stable coin for testing", 
            option::none(), 
            ctx
        );

      transfer::share_object(CapWrapper { id: object::new(ctx), cap: treasury });
      transfer::public_freeze_object(metadata);
  }

  // === Public-Mutative Functions ===  

  public fun burn(cap: &mut CapWrapper, coin_in: Coin<USDC>): u64 {
    coin::burn(&mut cap.cap, coin_in)
  }

  // === Public-Friend Functions ===  

  public fun mint(cap: &mut CapWrapper, value: u64, ctx: &mut TxContext): Coin<USDC> {
    coin::mint(&mut cap.cap, value, ctx)
  }

  // === Test Functions ===  

  #[test_only]
  public fun return_init_usdc(ctx: &mut TxContext) {
    init(USDC {}, ctx);
  }
}