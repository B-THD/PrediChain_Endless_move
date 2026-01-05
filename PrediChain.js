// 前端核心代码 (React + Endless Wallet Adapter)
import React, { useState, useEffect } from 'react';
import { WalletSelector } from "@endless-wallet/wallet-adapter-react-ui";
import { useWallet } from "@endless-wallet/wallet-adapter-react";
import { EndlessClient } from '@endless/sdk';

const PrediChainApp = () => {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [prediction, setPrediction] = useState('yes');
  const [aiInsights, setAiInsights] = useState([]);
  
  const endlessClient = new EndlessClient({
    network: 'testnet',
    nodeUrl: 'https://testnet.endless.link'
  });

  // 加载预测市场
  const loadMarkets = async () => {
    const marketsData = await endlessClient.view({
      moduleAddress: '0x8e12b4a3e8c5f7d2a9b4c6d3e8f5a2b1c9d8e7f6',
      moduleName: 'prediction_market',
      functionName: 'get_active_markets',
      typeArguments: ['0x1::eds::EDS'],
      arguments: []
    });
    setMarkets(marketsData);
  };

  // 创建新市场
  const createMarket = async (question, description, endTime, options) => {
    const payload = {
      type: 'entry_function_payload',
      function: '0x8e12b4a3e8c5f7d2a9b4c6d3e8f5a2b1c9d8e7f6::prediction_market::create_market',
      type_arguments: ['0x1::eds::EDS'],
      arguments: [question, description, endTime, options]
    };
    
    await signAndSubmitTransaction(payload);
  };

  // 下注
  const placeBet = async (marketId, amount, position) => {
    const payload = {
      type: 'entry_function_payload',
      function: '0x8e12b4a3e8c5f7d2a9b4c6d3e8f5a2b1c9d8e7f6::prediction_market::place_bet',
      type_arguments: ['0x1::eds::EDS'],
      arguments: [marketId, amount, position === 'yes' ? 1 : 2]
    };
    
    await signAndSubmitTransaction(payload);
  };

  // 获取AI洞察
  const fetchAIInsights = async (marketId) => {
    const insights = await endlessClient.view({
      moduleAddress: '0x8e12b4a3e8c5f7d2a9b4c6d3e8f5a2b1c9d8e7f6',
      moduleName: 'prediction_market',
      functionName: 'get_ai_insights',
      typeArguments: [],
      arguments: [marketId]
    });
    setAiInsights(insights);
  };

  // 自动做市策略（AI Agent模拟）
  const runAIMarketMaking = async (marketId) => {
    // 模拟AI Agent分析市场并自动调整价格
    const marketData = await endlessClient.getMarketData(marketId);
    
    // 基于市场不平衡度计算建议价格
    const imbalance = (marketData.yesPool - marketData.noPool) / marketData.totalPool;
    const suggestedPrice = 0.5 + (imbalance * 0.2);
    
    // 如果AI Agent有足够信心，可以自动下注
    if (Math.abs(imbalance) > 0.3) {
      const aiPosition = imbalance > 0 ? 'no' : 'yes'; // 反向操作，平衡市场
      const aiAmount = Math.floor(marketData.totalPool * 0.05); // 下注总资金的5%
      
      // 在实际实现中，这里会调用AI Agent的账户进行交易
      console.log(`AI建议：下注${aiAmount} EDS到"${aiPosition}"，当前赔率：${suggestedPrice}`);
    }
    
    return { suggestedPrice, imbalance };
  };

  useEffect(() => {
    if (connected) {
      loadMarkets();
    }
  }, [connected]);

  return (
    <div className="predichain-app">
      <header>
        <h1>PrediChain - AI增强预测市场</h1>
        <WalletSelector />
      </header>
      
      <div className="market-grid">
        {markets.map(market => (
          <div key={market.market_id} className="market-card">
            <h3>{market.question}</h3>
            <p>{market.description}</p>
            <div className="market-stats">
              <div>总资金池: {market.total_pool} EDS</div>
              <div>是: {market.yes_pool} EDS</div>
              <div>否: {market.no_pool} EDS</div>
              <div>结束时间: {new Date(market.end_time * 1000).toLocaleDateString()}</div>
            </div>
            
            {connected && market.is_active && (
              <div className="bet-section">
                <input 
                  type="number" 
                  placeholder="下注金额 (EDS)" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                />
                <select value={prediction} onChange={(e) => setPrediction(e.target.value)}>
                  <option value="yes">是</option>
                  <option value="no">否</option>
                </select>
                <button onClick={() => placeBet(market.market_id, betAmount, prediction)}>
                  下注
                </button>
              </div>
            )}
            
            <button onClick={() => {
              setSelectedMarket(market);
              fetchAIInsights(market.market_id);
            }}>
              查看AI分析
            </button>
          </div>
        ))}
      </div>
      
      {selectedMarket && (
        <div className="ai-insights-panel">
          <h3>AI市场洞察 - {selectedMarket.question}</h3>
          {aiInsights.map(insight => (
            <div key={insight.generated_at} className="insight-card">
              <div className="confidence-bar" style={{width: `${insight.confidence_score}%`}}>
                置信度: {insight.confidence_score}%
              </div>
              <p>{insight.reasoning}</p>
              <small>数据来源: {insight.data_sources.join(', ')}</small>
            </div>
          ))}
          
          <button onClick={() => runAIMarketMaking(selectedMarket.market_id)}>
            运行AI做市策略
          </button>
        </div>
      )}
    </div>
  );
};

export default PrediChainApp;