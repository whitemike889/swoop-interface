import React from 'react';
import {AutoColumn} from '../../components/Column';
import styled from 'styled-components';
// import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import {TYPE, ExternalLink} from '../../theme';
import PoolCard from '../../components/earn/PoolCard';
import {RowBetween} from '../../components/Row';
import {CardSection, DataCard, CardNoise, CardBGImage} from '../../components/earn/styled';
import {Countdown} from './Countdown';
import Loader from '../../components/Loader';
// import {useActiveHmyReact, useActiveWeb3React} from '../../hooks';
import {Token, TokenAmount} from '@swoop-exchange/sdk';
import {useAllTokens} from '../../hooks/Tokens';

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`;

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`;

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`;

// todo double for stake/hooks
export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // when the period ends
  periodFinish: Date | undefined
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount,
  ) => TokenAmount
}// todo double for stake/hooks
export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // when the period ends
  periodFinish: Date | undefined
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount,
  ) => TokenAmount
}


const makeStakingInfo = (token0, token1) => {
  const randomAmount = new TokenAmount(token0, '10');
  return {
    stakingRewardAddress: '',
    tokens: [
      token0,
      token1,
    ],
    stakedAmount: randomAmount,
    // the amount of reward token earned by the active account, or undefined if no account
    earnedAmount: randomAmount,
    // the total amount of token staked in the contract
    totalStakedAmount: randomAmount,
    // the amount of token distributed per second to all LPs, constant
    totalRewardRate: randomAmount,
    rewardRate: randomAmount,
    getHypotheticalRewardRate: (...a) => randomAmount,
    periodFinish: undefined,
  };
};

// todo hook

const mapBinanceTokenSymbol = {
  '1WBTC': 'BTC',
  'WBTC': 'BTC',
  'BUSD': 'BUSD',
  '1BUSD': 'BUSD',
  'LINK': 'LINK',
  '1LINK': 'LINK',
  '1WETH': 'ETH',
  '1ETH': 'ETH',
  'WETH': 'ETH',
  'WONE': 'ONE',
};
const getUSDRate = async (symbols, cb) => {
  const rates = {};

  try {
    await Promise.all(symbols.map(async (s) => {
      const symbol = mapBinanceTokenSymbol[s] || s;
      const pairSymbol = symbol + 'USDT';
      const res = await window.fetch(`https://api.binance.com/api/v3/avgPrice?symbol=${pairSymbol}`).then(r => r.json());

      rates[s] = res.price;
    }));
  } catch (err) {
    console.error(err.message);
    return;
  }

  cb(rates);
};

const tokens = [
  {
    "chainId": 1,
    "address": "0x3095c7557bCb296ccc6e363DE01b760bA031F2d9",
    "symbol": "1WBTC",
    "name": "Wrapped BTC",
    "decimals": 8,
    "logoURI": "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png"
  },
  {
    "chainId": 1,
    "address": "0xF720b7910C6b2FF5bd167171aDa211E226740bfe",
    "symbol": "1WETH",
    "name": "Wrapped Ether",
    "decimals": 18,
    "logoURI": "https://swoop-exchange.s3-us-west-1.amazonaws.com/tokens/1WETH.png"
  },
  {
    "chainId": 1,
    "address": "0xE176EBE47d621b984a73036B9DA5d834411ef734",
    "symbol": "BUSD",
    "name": "Binance USD",
    "decimals": 18,
    "logoURI": "https://assets.coingecko.com/coins/images/9576/small/BUSD.png"
  },
  {
    "chainId": 1,
    "address": "0x218532a12a389a4a92fC0C5Fb22901D1c19198aA",
    "symbol": "LINK",
    "name": "ChainLink Token",
    "decimals": 18,
    "logoURI": "https://swoop-exchange.s3-us-west-1.amazonaws.com/tokens/1LINK.png"
  },
  {
    "chainId": 1,
    "address": "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
    "symbol": "WONE",
    "name": "Wrapped ONE",
    "decimals": 18,
    "logoURI": "https://swoop-exchange.s3-us-west-1.amazonaws.com/tokens/WONE.png"
  },
  {
    "chainId": 1,
    "address": "0x6983D1E6DEf3690C4d616b13597A09e6193EA013",
    "symbol": "1ETH",
    "name": "Ether",
    "decimals": 18,
    "logoURI": "https://swoop-exchange.s3-us-west-1.amazonaws.com/tokens/1ETH.png"
  },
  ]


export default function Earn() {
  //const {chainId} = useActiveHmyReact();

  const AllTokens = tokens.map(t => new Token(1, t.address, t.decimals, t.symbol, t.name))//useAllTokens();

  // const widgetPairs = [['WONE', '1ETH'], ['WONE', 'BUSD'], ['LINK', '1WETH'], ['1WBTC', '1WETH']];
  const widgetPairs = [['WONE', '1ETH'], ['WONE', 'BUSD']];
  // const widgetPairs = [['WONE', '1BUSD'], ['1LINK', '1ETH'], ['WBTC', '1ETH']];

  const getTokenBySymbol = (symbol) => {
    return Object.values(AllTokens).find(t => t.symbol === symbol);
  };

  const [USDRates, setUSDRates] = React.useState({});

  const symbols = widgetPairs.flatMap(a => a);

  React.useEffect(() => {
    getUSDRate(symbols, setUSDRates);
    /*const interval = setInterval(() => {
      getUSDRate(symbols, setUSDRates);
    }, 30000);

    return () => clearInterval(interval);*/
  }, [symbols]);

  const stakingInfos = widgetPairs.map((p) => {

      try {
        return makeStakingInfo(
          getTokenBySymbol(p[0]),
          getTokenBySymbol(p[1]),
        );
      } catch (e) {
        return null;
      }
    },
  );


  const DataRow = styled(RowBetween)`
    ${({theme}) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
  `;

  //const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)
  const stakingRewardsExist = true;

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Swoop liquidity mining</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Adding liquidity to the below will earn you rewards.
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{color: 'white', textDecoration: 'underline'}}
                href="https://medium.com/harmony-one/swoop-ethereum-harmony-cross-chain-dex-launch-f9d08f760e4c"
                target="_blank"
              >
                <TYPE.white fontSize={14}>Read more about SWOOP</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{width: '100%', maxWidth: '720px'}}>
        <DataRow style={{alignItems: 'baseline'}}>
          <TYPE.mediumHeader style={{marginTop: '0.5rem'}}>
            {/*Participating pools*/}
            Pools
          </TYPE.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{margin: 'auto'}} />
          ) : !stakingRewardsExist ? (
            'No active rewards'
          ) : (
            stakingInfos?.map((stakingInfo, i) => {
              // need to sort by added liquidity here
              return <PoolCard USDRates={USDRates} index={i} key={i} stakingInfo={stakingInfo} />;
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  );
}