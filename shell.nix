let
  pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  packages = [
    (pkgs.python3.withPackages (python-pkgs: [
      python-pkgs.matplotlib
      python-pkgs.pandas
      python-pkgs.seaborn
      python-pkgs.numpy
    ]))
    pkgs.nodejs
  ];
}
