# PrediChain_Endless_move
PrediChain is a decentralized prediction market platform built on an Endless chain and enhanced with AI agents, designed to address the lack of high-quality, trustworthy on-chain prediction infrastructure in the Web3 ecosystem.

# Run
1. Clone the repository
git clone (https://github.com/B-THD/PrediChain_Endless_move.git)
cd predichain-endless-demo
2. Install dependencies
npm install
3. Configure environment variables
cp .env.example .env.local
# Edit the .env.local file and add information such as Endless testnet RPC
4. Start the development server
npm run dev
5. Access the application
Open http://localhost:3000


# Contract Deployment

Install Endless CLI
cargo install endless-cli

Compile Move contracts
endless move compile --package-dir ./contracts

Deploy to testnet
endless move publish
--private-key <your-private-key>

--profile testnet

--named-addresses predichain=0x<your-address>
