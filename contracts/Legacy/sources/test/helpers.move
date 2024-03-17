#[test_only]
module legacy::helpers {
    use sui::test_scenario::{Self as ts, next_tx, Scenario};
 
    use std::string::{Self};
    use std::vector;
    // use std::option::{Self};
    // use std::debug;

    use legacy::assets_legacy::{Self as legacy, Legacy};
    use tokens::usdc::{return_init_usdc};
    use tokens::usdt::{return_init_usdt};
    
    const TEST_ADDRESS1: address = @0xB;
    const TEST_ADDRESS2: address = @0xC;
    const TEST_ADDRESS3: address = @0xD;
    const TEST_ADDRESS4: address = @0xE; 
    const TEST_ADDRESS5: address = @0xF;   

    public fun add_heirs(scenario: &mut Scenario, perc1:u64, perc2:u64, perc3:u64, perc4:u64) {

    next_tx(scenario,TEST_ADDRESS1);
       { 
       let legacy = ts::take_shared<Legacy>(scenario);
  
       let heirs_address  = vector::empty();   
       let heirs_percentage = vector::empty(); 

       vector::push_back(&mut heirs_address, TEST_ADDRESS2);
       vector::push_back(&mut heirs_address, TEST_ADDRESS3); 
       vector::push_back(&mut heirs_address, TEST_ADDRESS4); 
       vector::push_back(&mut heirs_address, TEST_ADDRESS5);  

       vector::push_back(&mut heirs_percentage, perc1);
       vector::push_back(&mut heirs_percentage, perc2);
       vector::push_back(&mut heirs_percentage, perc3);
       vector::push_back(&mut heirs_percentage, perc4);

       legacy::new_heirs(&mut legacy, heirs_address, heirs_percentage, ts::ctx(scenario));  

       ts::return_shared(legacy);  
      };
    }
   
    public fun init_test_helper() : ts::Scenario{
      let owner: address = @0xA;
      let scenario_val = ts::begin(owner);
      let scenario = &mut scenario_val;

      {
         return_init_usdc(ts::ctx(scenario));
      };
        {
         return_init_usdt(ts::ctx(scenario));
      };

      scenario_val
}

}
