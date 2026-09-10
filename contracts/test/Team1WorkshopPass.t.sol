// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {Team1WorkshopPass} from "../src/Team1WorkshopPass.sol";
import {IERC721Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";

contract Team1WorkshopPassTest is Test {
    Team1WorkshopPass internal pass;

    address internal orador = address(0xEbC2);
    address internal respaldo = address(0xBEEF);
    address internal asistente = address(0xCAFE);

    event PassMinted(address indexed to, uint256 indexed tokenId, uint256 mintedAt);

    function setUp() public {
        pass = new Team1WorkshopPass();
    }

    // --- Identidad -----------------------------------------------------------

    function test_NombreYSimbolo() public view {
        assertEq(pass.name(), "Team1 Workshop Pass");
        assertEq(pass.symbol(), "T1PASS");
    }

    function test_SoportaInterfazERC721() public view {
        assertTrue(pass.supportsInterface(0x80ac58cd)); // ERC721
        assertTrue(pass.supportsInterface(0x5b5e139f)); // ERC721Metadata
        assertTrue(pass.supportsInterface(0x01ffc9a7)); // ERC165
    }

    // --- Acunacion -----------------------------------------------------------

    function test_ArrancaVacio() public view {
        assertEq(pass.totalMinted(), 0);
        assertFalse(pass.hasPass(orador));
    }

    function test_AcunaConTokenIdUno() public {
        vm.prank(orador);
        uint256 tokenId = pass.mint();

        assertEq(tokenId, 1, "el primer pass es el #1");
        assertEq(pass.ownerOf(1), orador);
        assertEq(pass.balanceOf(orador), 1);
        assertTrue(pass.hasPass(orador));
        assertEq(pass.passTokenIdOf(orador), 1);
        assertEq(pass.totalMinted(), 1);
    }

    function test_TokenIdsCorrelativos() public {
        vm.prank(orador);
        assertEq(pass.mint(), 1);

        vm.prank(respaldo);
        assertEq(pass.mint(), 2);

        vm.prank(asistente);
        assertEq(pass.mint(), 3);

        assertEq(pass.totalMinted(), 3);
    }

    function test_EmiteEventoPassMinted() public {
        vm.expectEmit(true, true, true, true, address(pass));
        emit PassMinted(orador, 1, block.timestamp);

        vm.prank(orador);
        pass.mint();
    }

    /// El caso de doble acunacion que pide RNF-08.
    function test_RevierteSiLaDireccionYaTienePass() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        vm.expectRevert(
            abi.encodeWithSelector(Team1WorkshopPass.PassAlreadyMinted.selector, orador)
        );
        pass.mint();
    }

    function test_DobleAcunacionNoAlteraElEstado() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        vm.expectRevert();
        pass.mint();

        assertEq(pass.totalMinted(), 1, "un intento fallido no consume tokenId");
        assertEq(pass.balanceOf(orador), 1);
    }

    function test_OtraDireccionSiPuedeAcunarDespuesDeUnFallo() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        vm.expectRevert();
        pass.mint();

        vm.prank(respaldo);
        assertEq(pass.mint(), 2, "el tokenId sigue siendo correlativo");
    }

    function testFuzz_CadaDireccionAcunaUnaSolaVez(address account) public {
        vm.assume(account != address(0));
        vm.assume(account.code.length == 0); // _safeMint exige onERC721Received en contratos

        vm.prank(account);
        pass.mint();
        assertTrue(pass.hasPass(account));

        vm.prank(account);
        vm.expectRevert(
            abi.encodeWithSelector(Team1WorkshopPass.PassAlreadyMinted.selector, account)
        );
        pass.mint();
    }

    // --- Soulbound -----------------------------------------------------------

    /// El caso soulbound que pide RNF-08.
    function test_TransferFromRevierte() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        vm.expectRevert(Team1WorkshopPass.PassIsSoulbound.selector);
        pass.transferFrom(orador, respaldo, 1);
    }

    function test_SafeTransferFromRevierte() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        vm.expectRevert(Team1WorkshopPass.PassIsSoulbound.selector);
        pass.safeTransferFrom(orador, respaldo, 1);
    }

    function test_SafeTransferFromConDataRevierte() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        vm.expectRevert(Team1WorkshopPass.PassIsSoulbound.selector);
        pass.safeTransferFrom(orador, respaldo, 1, "");
    }

    /// Ni siquiera un tercero aprobado puede moverlo.
    function test_TransferenciaDeUnAprobadoRevierte() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        pass.approve(asistente, 1);

        vm.prank(asistente);
        vm.expectRevert(Team1WorkshopPass.PassIsSoulbound.selector);
        pass.transferFrom(orador, respaldo, 1);
    }

    function test_OperadorGlobalTampocoPuedeTransferir() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        pass.setApprovalForAll(asistente, true);

        vm.prank(asistente);
        vm.expectRevert(Team1WorkshopPass.PassIsSoulbound.selector);
        pass.transferFrom(orador, respaldo, 1);
    }

    function test_ElPassSigueSiendoDelDuenoDespuesDeUnIntento() public {
        vm.prank(orador);
        pass.mint();

        vm.prank(orador);
        vm.expectRevert();
        pass.transferFrom(orador, respaldo, 1);

        assertEq(pass.ownerOf(1), orador);
        assertTrue(pass.hasPass(orador));
        assertFalse(pass.hasPass(respaldo));
    }

    // --- Consultas de lectura ------------------------------------------------

    function test_HasPassEnCeroNoRevierte() public view {
        assertFalse(pass.hasPass(address(0)));
    }

    function test_PassTokenIdOfDevuelveCeroSinPass() public view {
        assertEq(pass.passTokenIdOf(asistente), 0);
    }

    // --- Metadatos on-chain --------------------------------------------------

    function test_TokenURIEsUnDataURI() public {
        vm.prank(orador);
        pass.mint();

        string memory uri = pass.tokenURI(1);
        assertTrue(_empiezaCon(uri, "data:application/json;base64,"), "debe ser un data URI");
        assertGt(bytes(uri).length, 200, "el JSON con el SVG no puede estar vacio");
    }

    function test_TokenURIDeTokenInexistenteRevierte() public {
        vm.expectRevert(
            abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 99)
        );
        pass.tokenURI(99);
    }

    // --- Helpers -------------------------------------------------------------

    function _empiezaCon(string memory haystack, string memory needle) private pure returns (bool) {
        bytes memory h = bytes(haystack);
        bytes memory n = bytes(needle);
        if (h.length < n.length) return false;
        for (uint256 i = 0; i < n.length; ++i) {
            if (h[i] != n[i]) return false;
        }
        return true;
    }
}
