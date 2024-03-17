# Legacy - Decentralized Legacy Module

## Introduction
Legacy is a module that enables individuals to distribute their token assets to designated persons and percentages at a specific time in the future.

## Features
- The new_legacy function allows users to create a legacy share object. When creating their legacy, users need only enter when it will be distributed. Other parameters will be default.
- The deposit_legacy function allows legacy owners to deposit any token into their legacy. These deposited tokens are stored within a bag as <string, vector<string>>.
- The new_heirs function allows legacy owners to enter heirs and their percentages. The total of the percentages must equal 100, and at least one address must be entered.
- The distribute function can only be called by one of the heirs. After the time for the legacy has arrived, the heirs can call this function to have the shares stored in the heirs_amount bag distributed to them according to their percentages.
- The withdraw function allows heirs to withdraw a specific coin after the legacy has been distributed.

  ## How to Use 






