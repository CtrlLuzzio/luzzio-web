{
  description = "Dev environment for luzzio-web";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [
        pkgs.nodejs_22
        pkgs.pnpm
      ];

      shellHook = ''
        export PNPM_HOME="$PWD/.pnpm-store"
        export PATH="$PNPM_HOME/bin:$PATH"
        echo "Dev environment ready."
      '';
    };
  };
}