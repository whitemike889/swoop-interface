import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
// import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import {Token, TokenAmount} from '@swoop-exchange/sdk';

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

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
    totalRewardRate: TokenAmount
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
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

export default function Earn() {
  const { chainId } = useActiveWeb3React()
  //const stakingInfos = useStakingInfo()
  const tmpToken = new Token(1, '0xF720b7910C6b2FF5bd167171aDa211E226740bfe', 18,'AAA', 'AAA')
 const stakingInfos: StakingInfo[] = [
    {
      stakingRewardAddress: '0xF720b7910C6b2FF5bd167171aDa211E226740bfe',
      tokens: [
        new Token(1, '0xF720b7910C6b2FF5bd167171aDa211E226740bfe', 18,'1WBTC', '1WBTC'),
        new Token(1, '0x218532a12a389a4a92fC0C5Fb22901D1c19198aA', 18, '1ETH', '1ETH')
      ],
      stakedAmount: new TokenAmount(tmpToken, '10'),
      // the amount of reward token earned by the active account, or undefined if no account
      earnedAmount: new TokenAmount(tmpToken, '10'),
      // the total amount of token staked in the contract
      totalStakedAmount: new TokenAmount(tmpToken, '10'),
      // the amount of token distributed per second to all LPs, constant
      totalRewardRate: new TokenAmount(tmpToken, '10'),
      rewardRate: new TokenAmount(tmpToken, '10'),
      getHypotheticalRewardRate: (...a) => new TokenAmount(tmpToken, '0'),
      periodFinish: undefined
    },


   {
     stakingRewardAddress: '0xF720b7910C6b2FF5bd167171aDa211E226740bfe',
     tokens: [
       new Token(1, '0xF720b7910C6b2FF5bd167171aDa211E226740bfe', 18,'LINK', 'LINK'),
       new Token(1, '0x218532a12a389a4a92fC0C5Fb22901D1c19198aA', 18, '1ETH', '1ETH')
     ],
     stakedAmount: new TokenAmount(tmpToken, '10'),
     // the amount of reward token earned by the active account, or undefined if no account
     earnedAmount: new TokenAmount(tmpToken, '10'),
     // the total amount of token staked in the contract
     totalStakedAmount: new TokenAmount(tmpToken, '10'),
     // the amount of token distributed per second to all LPs, constant
     totalRewardRate: new TokenAmount(tmpToken, '10'),
     rewardRate: new TokenAmount(tmpToken, '10'),
     getHypotheticalRewardRate: (...a) => new TokenAmount(tmpToken, '0'),
     periodFinish: undefined
   }
  ]


  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
  `

  //const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)
  const stakingRewardsExist = true

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
                style={{ color: 'white', textDecoration: 'underline' }}
                href=""
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

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            'No active rewards'
          ) : (
            stakingInfos?.map(stakingInfo => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}