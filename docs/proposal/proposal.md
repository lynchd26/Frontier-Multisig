# School of Computing &mdash; Year 4 Project Proposal Form


## SECTION A

|                     |                             |
|---------------------|-----------------------------|
|Project Title:       | Ethereum MultiSig Wallet    |
|Student 1 Name:      | Dara Lynch                  |
|Student 1 ID:        | 19324446                    |
|Student 2 Name:      | Alan McGrath                |
|Student 2 ID:        | 19392951                    |
|Project Supervisor:  | Irina Tal                   |

> Ensure that the Supervisor formally agrees to supervise your project; this is only recognised once the
> Supervisor assigns herself/himself via the project Dashboard.
>
> Project proposals without an assigned
> Supervisor will not be accepted for presentation to the Approval Panel.


## SECTION B
 
 
### Introduction
 
> A multisignature ethereum wallet which allows multiple users to approve or deny transactions before the funds are deducted from said wallet. A primary user will create the wallet and give a key to other users so that they can vote to approve or deny transactions.
 
 
### Outline
 
> Multi-Signature Wallet running on Ethereum. Users can create the wallet and add owners (wallet addresses). Users can start transactions which then need to be approved by all users, or a number of users specified by the admin. Users can approve or deny the transactions. A transaction should have a note or tag attached, which will explain what the transaction is for. The original creator/administrator will have additional options to set the number of approvals required, a daily/weekly spending limit for transactions that don’t need approval, create tags which will make it easier to categorise transactions and give them context for other users. 
 
 
### Background
 
> Due to the immutable nature of blockchain technology, should you become a victim of a scam or an attacker gets access to your wallet, your funds can be lost forever with no way of getting it back. With this in consideration, it is desirable for wallet owners to have an additional level of protection. A multisig wallet will give users extra security in this regard as a single breach would not be enough for an attacker to take the funds from the wallet.
> 
> This can also be used as a shared or company wallet. By requiring multiple approvals for a transaction, the wallet users can have access to a shared wallet without making the funds susceptible to a rogue user or a negligent user having a security breach.
 
 
### Achievements
 
> Each wallet will consist of a primary user, who can set privileges for each transaction, i.e. how many signatures are needed for approval or if certain transactions even need to be approved. An example of a transaction that may not need approval could be something necessary like electricity bills. Users may be individuals who want additional security for their wallet or a number of users who want a shared wallet with no risk of one users being able to take all the funds.   
 
 
### Justification
 
> This project provides additional security to a wallet as it requires multiple signatures to make a transaction. This would prove very useful in certain situations, such as a shared account within a business. If one account experiences a breach of security, the contents of the wallet will not be at risk as it is necessary that all users approve the transaction before it is made.
 
 
### Programming language(s)
 
> -Solidity
>
> -NextJS
>
> -HTML
>
> -Tailwind CSS
> 
 
 
### Programming tools / Tech stack
 
> -Hardhat
>
> -Open Zeppelin
>
> -Vercel
>
> -Infura
>
> -IPFS
> 
 
### Learning Challenges
 
> -While we have used Solidity briefly before, this project should require far more detail and knowledge of smart contracts. 
>
>
> -As a large focus of our project is security, we will learn about how to write industry standard smart contracts in terms of security.
>
>
> -We would like to have a good system for testing and validation. We will learn how we can run or automate these tests through Hardhat. 
>
>
> -Learn how to implement git pipelines. 
>         
 
 
### Breakdown of work
 
#### Dara Lynch
 
> -Smart Contracts
>
> -Backend Development
>
> -Front End Development
>
> -Exploring git development systems and ensuring proper use of git throughout the project lifecycle.
>
 
#### Alan Mc Grath
 
> -Smart Contracts
>
> -Backend Development
>
> -Front End Development
>
> -Research possible testing systems and frameworks and implement automated testing into our project development
>
