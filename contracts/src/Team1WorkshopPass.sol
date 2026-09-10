// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title Team1 Workshop Pass
 * @notice Credencial de acceso al workshop "NFT mas alla del arte" (Team1 LatAm).
 *
 * Tres reglas viven dentro del token, no en un servidor:
 *
 *   1. Es soulbound: una vez acunado no se puede transferir ni quemar.
 *      Un pase de acceso a un evento no se revende.
 *   2. Uno por direccion: el segundo intento revierte con un error con nombre.
 *   3. Los metadatos son on-chain: `tokenURI` arma el JSON y el SVG dentro
 *      del contrato. Sin IPFS y sin servidor de imagenes.
 *
 * No tiene dueno, ni pausa, ni funciones administrativas. Cualquiera acuna el suyo.
 */
contract Team1WorkshopPass is ERC721 {
    /// @notice Se emite cuando una direccion acuna su pass.
    event PassMinted(address indexed to, uint256 indexed tokenId, uint256 mintedAt);

    /// @notice La direccion ya tiene un pass. Uno por direccion.
    error PassAlreadyMinted(address account);

    /// @notice El pass no se puede transferir ni quemar.
    error PassIsSoulbound();

    /// @dev Proximo tokenId a asignar. Arranca en 1 para que 0 signifique "sin pass".
    uint256 private _nextTokenId = 1;

    /// @dev Pass de cada direccion. 0 significa que no tiene.
    mapping(address account => uint256 tokenId) private _passTokenId;

    /// @dev Momento de acunacion de cada pass, para mostrarlo en la imagen.
    mapping(uint256 tokenId => uint256 timestamp) private _mintedAt;

    constructor() ERC721("Team1 Workshop Pass", "T1PASS") {}

    /**
     * @notice Acuna el pass para quien llama. Uno por direccion.
     * @return tokenId Identificador correlativo, empezando en 1.
     */
    function mint() external returns (uint256 tokenId) {
        if (_passTokenId[msg.sender] != 0) {
            revert PassAlreadyMinted(msg.sender);
        }

        tokenId = _nextTokenId;
        unchecked {
            _nextTokenId = tokenId + 1;
        }

        _passTokenId[msg.sender] = tokenId;
        _mintedAt[tokenId] = block.timestamp;

        _safeMint(msg.sender, tokenId);

        emit PassMinted(msg.sender, tokenId, block.timestamp);
    }

    /// @notice Responde si una direccion tiene el pass. Es la consulta que hace la app.
    function hasPass(address account) external view returns (bool) {
        return _passTokenId[account] != 0;
    }

    /// @notice Devuelve el pass de una direccion, o 0 si no tiene.
    function passTokenIdOf(address account) external view returns (uint256) {
        return _passTokenId[account];
    }

    /// @notice Cantidad total de passes acunados.
    function totalMinted() external view returns (uint256) {
        unchecked {
            return _nextTokenId - 1;
        }
    }

    /// @notice Metadatos completos en un data URI. Nada vive fuera de la cadena.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        address owner = _requireOwned(tokenId);

        string memory id = Strings.toString(tokenId);
        string memory image = Base64.encode(bytes(_svg(tokenId, owner)));

        string memory json = string.concat(
            '{"name":"Team1 Workshop Pass #', id,
            '","description":"Credencial de acceso al workshop \\u0022NFT mas alla del arte\\u0022 de Team1 LatAm, en Avalanche Fuji. No transferible.',
            '","image":"data:image/svg+xml;base64,', image,
            '","attributes":[',
            '{"trait_type":"Evento","value":"NFT mas alla del arte"},',
            '{"trait_type":"Comunidad","value":"Team1 LatAm"},',
            '{"trait_type":"Red","value":"Avalanche Fuji"},',
            '{"trait_type":"Transferible","value":"No"},',
            '{"display_type":"date","trait_type":"Acunado","value":', Strings.toString(_mintedAt[tokenId]), '}',
            ']}'
        );

        return string.concat("data:application/json;base64,", Base64.encode(bytes(json)));
    }

    /**
     * @dev Aca vive la regla soulbound.
     *
     * OZ v5 hace pasar por `_update` toda acunacion, transferencia y quema.
     * En una acunacion el dueno anterior es la direccion cero; en cualquier
     * otro caso hay un dueno previo y la operacion se rechaza.
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            revert PassIsSoulbound();
        }
        return super._update(to, tokenId, auth);
    }

    /// @dev Imagen del pass, generada dentro del contrato con la paleta del deck.
    function _svg(uint256 tokenId, address owner) private pure returns (string memory) {
        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">',
            '<rect width="600" height="600" fill="#08090C"/>',
            '<rect x="24" y="24" width="552" height="552" rx="28" fill="none" stroke="#E84142" stroke-width="3"/>',
            '<text x="64" y="120" fill="#E84142" font-family="Helvetica,Arial,sans-serif" font-size="26" font-weight="bold" letter-spacing="6">TEAM1 LATAM</text>',
            '<text x="64" y="216" fill="#F5F5F7" font-family="Helvetica,Arial,sans-serif" font-size="60" font-weight="bold">WORKSHOP</text>',
            '<text x="64" y="286" fill="#F5F5F7" font-family="Helvetica,Arial,sans-serif" font-size="60" font-weight="bold">PASS</text>',
            '<text x="64" y="360" fill="#8A8F98" font-family="Helvetica,Arial,sans-serif" font-size="24">NFT mas alla del arte</text>',
            '<line x1="64" y1="404" x2="536" y2="404" stroke="#1E2027" stroke-width="2"/>',
            '<text x="64" y="452" fill="#8A8F98" font-family="Helvetica,Arial,sans-serif" font-size="20">PASS</text>',
            '<text x="64" y="492" fill="#E84142" font-family="Helvetica,Arial,sans-serif" font-size="40" font-weight="bold">#', Strings.toString(tokenId), '</text>',
            '<text x="64" y="536" fill="#8A8F98" font-family="Helvetica,Arial,sans-serif" font-size="20">', _shortAddress(owner), '</text>',
            '<text x="536" y="536" text-anchor="end" fill="#8A8F98" font-family="Helvetica,Arial,sans-serif" font-size="20">AVALANCHE FUJI</text>',
            '<text x="536" y="492" text-anchor="end" fill="#E84142" font-family="Helvetica,Arial,sans-serif" font-size="20" font-weight="bold">NO TRANSFERIBLE</text>',
            '</svg>'
        );
    }

    /// @dev Direccion abreviada, "0xEbC2...6523", para que entre en la imagen.
    function _shortAddress(address account) private pure returns (string memory) {
        bytes memory full = bytes(Strings.toHexString(uint160(account), 20)); // 42 caracteres
        bytes memory short = new bytes(13);

        for (uint256 i = 0; i < 6; ++i) {
            short[i] = full[i];
        }
        short[6] = ".";
        short[7] = ".";
        short[8] = ".";
        for (uint256 i = 0; i < 4; ++i) {
            short[9 + i] = full[38 + i];
        }

        return string(short);
    }
}
