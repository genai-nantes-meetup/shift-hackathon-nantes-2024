{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "smart-files";
  buildInputs = with pkgs; [
    python312
    nodejs_22
    electron_30-bin
    yarn
    poetry
  ];
}
