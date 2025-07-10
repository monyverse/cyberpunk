
## 🌆 Filecoin Contracts


npx hardhat deploy --tags Filecoin --network filecoin

***** Deploying Contracts on Filecoin *****
Deploying with account: 0xC3aA518408938854DA4fb75feE44926304901865
Axelar Gateway (Filecoin): 0x999117D44220F33e0441fbAb2A5aDB8FF485c54D
Axelar Gas Service (Filecoin): 0xbe406f0189a0b4cf3a05c286473d23791dd44cc6
duplicate definition - InvalidAddress()
duplicate definition - InvalidAddress()
deploying "DealClientAxl" (tx: 0x92df2de1d3f19a67ebbfee4b280db3079b75234e1aa45afa75e480dc4f069ff1)...: deployed at 0xaf7123897b369b06c512d620F633BBA6FCBD6754 with 146945293 gas
🚀 Prover_Axelar Contract Deployed at:  0xaf7123897b369b06c512d620F633BBA6FCBD6754

npx hardhat deploy --tags SourceChain --network avalanche

Nothing to compile
No need to generate any newer typings.
***** Deploying Contracts on Source Chain: avalanche *****
Deploying with account: 0xC3aA518408938854DA4fb75feE44926304901865
Axelar Gateway (Source - avalanche): 0xC249632c2D40b9001FE907806902f63038B737Ab
Axelar Gateway (Destination - Filecoin): 0x999117D44220F33e0441fbAb2A5aDB8FF485c54D
deploying "OnRampContract" (tx: 0x92998c9958a193444eb215730b8281282ec1fd197a2a6b4df174efb9d584e374)...: deployed at 0xd7EEf3bd4C819C277B34ab1BdF1D7044c43c311B with 2308102 gas
🚀 OnRamp Contract Deployed at:  0xd7EEf3bd4C819C277B34ab1BdF1D7044c43c311B
deploying "AxelarBridge" (tx: 0x4bee649fc4558e0e1cc71cffd3fa719f4bceede1c3e0e0b3dea8161ad6ac0d03)...: deployed at 0xaf7123897b369b06c512d620F633BBA6FCBD6754 with 718360 gas
🚀 Oracle Contract Deployed at:  0xaf7123897b369b06c512d620F633BBA6FCBD6754

npx hardhat deploy --tags ConfigFilecoin --network filecoin

Nothing to compile
No need to generate any newer typings.
***** Deploying Contracts on Filecoin *****
Deploying with account: 0xC3aA518408938854DA4fb75feE44926304901865
Axelar Gateway (Filecoin): 0x999117D44220F33e0441fbAb2A5aDB8FF485c54D
Axelar Gas Service (Filecoin): 0xbe406f0189a0b4cf3a05c286473d23791dd44cc6
duplicate definition - InvalidAddress()
reusing "DealClientAxl" at 0xaf7123897b369b06c512d620F633BBA6FCBD6754
🚀 Prover_Axelar Contract Deployed at:  0xaf7123897b369b06c512d620F633BBA6FCBD6754
***** Running Filecoin Configuration *****
DealClientAxl Contract located at:  0xaf7123897b369b06c512d620F633BBA6FCBD6754
🔗 Detected source chains: avalanche
🚀 Configuring DealClientAxl for source chain: avalanche & 0xaf7123897b369b06c512d620F633BBA6FCBD6754
✅ Destination chain avalanche configured: 0xa5dc4ccd1bcac122b2fb2b33c6a3e7543e22237b3e383366a34688b4e58abc8b
Chain ID: 43113
Chain Name: avalanche
Source Oracle Address: 0xaf7123897b369b06c512d620F633BBA6FCBD6754
🚀 Configuring DealClientAxl to add GAS for Axelar gas service.
AddGasFunds Transaction sent: 0xe75cd5500a4e79c5ebad2bf43d324663d2997dcfcb65bbbbdcfbb1f062aa75c6
Transaction confirmed!

npx hardhat deploy --tags ConfigSourceChain --network avalanche

Nothing to compile
No need to generate any newer typings.
***** Deploying Contracts on Source Chain: avalanche *****
Deploying with account: 0xC3aA518408938854DA4fb75feE44926304901865
Axelar Gateway (Source - avalanche): 0xC249632c2D40b9001FE907806902f63038B737Ab
Axelar Gateway (Destination - Filecoin): 0x999117D44220F33e0441fbAb2A5aDB8FF485c54D
reusing "OnRampContract" at 0xd7EEf3bd4C819C277B34ab1BdF1D7044c43c311B
🚀 OnRamp Contract Deployed at:  0xd7EEf3bd4C819C277B34ab1BdF1D7044c43c311B
reusing "AxelarBridge" at 0xaf7123897b369b06c512d620F633BBA6FCBD6754
🚀 Oracle Contract Deployed at:  0xaf7123897b369b06c512d620F633BBA6FCBD6754
***** Running Source Chain Configuration *****
🚀 Configuring OnRampContract at 0xd7EEf3bd4C819C277B34ab1BdF1D7044c43c311B...
✅ OnRamp Oracle set: 0xfbf7445007ac7b8021a6cf4d34e5b8e34ee3b659e3664070dfdd1d5c168be168
🚀 Configuring AxelarBridge at 0xaf7123897b369b06c512d620F633BBA6FCBD6754...
✅ AxelarBridge sender/receiver set: 0x56554f03f0e5f9a0143b9803cc7ee9e79dd80753dc04914b7b330d43720bf668
AxelarBridge Receiver Address is 0xd7EEf3bd4C819C277B34ab1BdF1D7044c43c311B
AxelarBridge Sender Address is 0xaf7123897b369b06c512d620F633BBA6FCBD6754

xchainClient % ./xchainClient generate-account --keystore-file ./config/xchain_key.json --password "$XCHAIN_PASSPHRASE"

New Ethereum account created!
Address: 0x8764C681dA2d29BBE41084352432371CAcc4FA52
Keystore File Path: ./config/xchain_key.json