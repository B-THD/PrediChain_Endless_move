# 安装Endless CLI
cargo install endless-cli

# 编译Move合约
endless move compile --package-dir ./contracts

# 部署到测试网
endless move publish \
  --private-key <your-private-key> \
  --profile testnet \
  --named-addresses predichain=0x<your-address>