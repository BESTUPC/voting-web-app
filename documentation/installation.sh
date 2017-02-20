#!/bin/bash -   
#title          :installation.sh
#description    :Script for installing the developing enviroment for BEST Barcelona WebApp
#author         :Esteve Tarragó i Adrià Quesada
#date           :20170218
#version        :1.0
#usage          :./installation.sh
#notes          :       
#bash_version   :4.3.42(1)-release
#============================================================================

#Variables
OS=$(lsb_release -si)
ARCH=$(uname -m | sed 's/x86_//;s/i[3-6]86/32/')
VER=$(lsb_release -sr)
RED='\033[0;41;30m'
STD='\033[0;0;39m'

SCRIPT_ROOT=$(pwd)
PROJECT_ROOT="$(dirname "$SCRIPT_ROOT")"

install_debian() {
	echo -e "$RED Debian or Debian derivative OS distro detected, installing programs.. $STD"
	DEBIAN_PROGS="nodejs npm mongodb build-essential"
	sudo apt-get update
	curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
	sudo apt-get install -y $DEBIAN_PROGS
}

install_arch() {
	echo -e "$RED Arch or Arch derivative OS distro detected, installing programs.. $STD"
	ARCH_PROGS="nodejs npm mongodb"
	yaourt -Syu;
	yaourt -S $ARCH_PROGS
}


main() {
	#create the db folder inside the project root
	mkdir -p ""$PROJECT_ROOT"/db"

	if [ "$OS" == "Ubuntu" ] || [ "$OS" == "Debian" ]  
		then
			install_debian
	elif [ "$OS" == "Arch" ] || [ "$OS" == "ManjaroLinux" ] || [ "$OS" == "Antergos" ]
        	then
			install_arch
	fi
sudo systemctl start mongod;
}

#Call to main, start of the script
main
