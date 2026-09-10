// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Team1WorkshopPass} from "../src/Team1WorkshopPass.sol";

/**
 * Despliega Team1WorkshopPass.
 *
 *   forge script script/DeployPass.s.sol --rpc-url fuji --broadcast --verify
 *
 * Necesita PRIVATE_KEY en el entorno. El contrato no tiene dueno:
 * quien despliega no queda con ningun privilegio sobre el.
 */
contract DeployPass is Script {
    function run() external returns (Team1WorkshopPass pass) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        pass = new Team1WorkshopPass();
        vm.stopBroadcast();

        console.log("Team1WorkshopPass:", address(pass));
        console.log("chainId:", block.chainid);
        console.log("totalMinted:", pass.totalMinted());
    }
}
