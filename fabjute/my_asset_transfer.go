package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Asset struct {
	Name           string `json:"assetName"`
	Code           string `json:"assetCode"`
	ID             string `json:"assetID"`
	Owner          string `json:"owner"`
	Manufacturer   string `json:"manufacturer"`
	Status         string `json:"status"`
	Responsibility string `json:"responsibility"`
	Inspector      string `json:"inspector"`
	TotalScore     string `json:"totalScore"`
	Variety        string `json:"variety"`
	ReedLength     string `json:"reedLength"`
	Strength       string `json:"strength"`
	Defects        string `json:"defects"`
	RootContent    string `json:"rootContent"`
	Fineness       string `json:"fineness"`
	Colour         string `json:"colour"`
}

type SmartContract struct {
	contractapi.Contract
}

func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, assetID string) error {
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get verified OrgID: %v", err)
	}

	// Creating asset Asset
	asset := Asset{
		Name:           "Jute",
		Code:           "16",
		ID:             assetID,
		Owner:          clientMSPID,
		Manufacturer:   clientMSPID,
		Status:         "Not Inspected",
		Responsibility: clientMSPID,
	}

	//converting to bytes
	assetBytes, err := json.Marshal(asset)
	if err != nil {
		return fmt.Errorf("failed to create asset JSON: %v", err)
	}

	err = ctx.GetStub().PutState(asset.ID, assetBytes)
	if err != nil {
		return fmt.Errorf("failed to put asset in public data: %v", err)
	}

	return nil
}

func (s *SmartContract) SendAsset(ctx contractapi.TransactionContextInterface, assetID string) error {

	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get verified OrgID: %v", err)
	}

	transientMap, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("error getting transient: %v", err)
	}
	// Asset properties must be retrieved from the transient field as they are private
	transientdeliveryId, ok := transientMap["deliveryId"]
	if !ok {
		return fmt.Errorf("deliveryId key not found in the transient map")
	}

	collection := clientMSPID + "PrivateCollection"
	err = ctx.GetStub().PutPrivateData(collection, assetID, transientdeliveryId)
	if err != nil {
		return fmt.Errorf("failed to put Asset private details: %v", err)
	}
	return nil
}

func (s *SmartContract) ReceiveAsset(ctx contractapi.TransactionContextInterface, assetID string) error {
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get verified OrgID: %v", err)
	}

	transientMap, err := ctx.GetStub().GetTransient()
	if err != nil {
		return fmt.Errorf("error getting transient: %v", err)
	}
	// Asset properties must be retrieved from the transient field as they are private
	transientdeliveryId, ok := transientMap["deliveryId"]
	if !ok {
		return fmt.Errorf("deliveryId key not found in the transient map")
	}

	collection := clientMSPID + "PrivateCollection"
	err = ctx.GetStub().PutPrivateData(collection, assetID, transientdeliveryId)
	if err != nil {
		return fmt.Errorf("failed to put Asset private details: %v", err)
	}
	return nil
}

func (s *SmartContract) TransferAsset(ctx contractapi.TransactionContextInterface, assetID string, buyerOrgID string) error {
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get verified OrgID: %v", err)
	}

	asset, err := s.ReadAsset(ctx, assetID)
	if err != nil {
		return fmt.Errorf("failed to get asset: %v", err)
	}

	if asset.Owner != clientMSPID {
		return fmt.Errorf("a client from %s cannot transfer a asset owned by %s", clientMSPID, asset.Owner)
	}

	err = verifyTransferConditions(ctx, assetID, clientMSPID, buyerOrgID)
	if err != nil {
		return fmt.Errorf("failed transfer verification: %v", err)
	}

	err = transferAssetState(ctx, asset, clientMSPID, buyerOrgID)
	if err != nil {
		return fmt.Errorf("failed asset transfer: %v", err)
	}

	return nil
}

func (s *SmartContract) TransferResponsibility(ctx contractapi.TransactionContextInterface, assetID string, buyerOrgID string) error {
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get verified OrgID: %v", err)
	}

	asset, err := s.ReadAsset(ctx, assetID)
	if err != nil {
		return fmt.Errorf("failed to get asset: %v", err)
	}

	if asset.Responsibility != clientMSPID {
		return fmt.Errorf("%s holds responsibility of the asset owned by %s", asset.Responsibility)
	}

	err = verifyTransferConditions(ctx, asset.ID, clientMSPID, buyerOrgID)
	if err != nil {
		return fmt.Errorf("failed transfer verification: %v", err)
	}

	err = transferAssetResposibilityState(ctx, asset, clientMSPID, buyerOrgID)
	if err != nil {
		return fmt.Errorf("failed asset transfer responsibility : %v", err)
	}

	return nil
}

func (s *SmartContract) InspectAsset(ctx contractapi.TransactionContextInterface,
	assetID string,
	totalScore string,
	variety string,
	reedLength string,
	strength string,
	defects string,
	rootContent string,
	fineness string,
	colour string) error {

	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get verified OrgID: %v", err)
	}

	asset, err := s.ReadAsset(ctx, assetID)
	if err != nil {
		return fmt.Errorf("failed to get asset: %v", err)
	}

	if asset.Responsibility != clientMSPID {
		return fmt.Errorf("You cant inspect this asset as you dont have responsibility")
	}

	// Creating asset Asset

	asset.TotalScore = totalScore
	asset.Variety = variety
	asset.ReedLength = reedLength
	asset.Strength = strength
	asset.Defects = defects
	asset.RootContent = rootContent
	asset.Fineness = fineness
	asset.Colour = colour

	//converting to bytes
	assetBytes, err := json.Marshal(asset)
	if err != nil {
		return fmt.Errorf("failed to create asset JSON: %v", err)
	}

	err = ctx.GetStub().PutState(asset.ID, assetBytes)
	if err != nil {
		return fmt.Errorf("failed to put asset in public data: %v", err)
	}

	return nil
}

func verifyTransferConditions(ctx contractapi.TransactionContextInterface,
	assetID string,
	clientMSPID string,
	buyerOrgID string) error {

	collectionSender := clientMSPID + "PrivateCollection"
	collectionReceiver := buyerOrgID + "PrivateCollection"

	immutableHash, err := ctx.GetStub().GetPrivateDataHash(collectionReceiver, assetID)
	if err != nil {
		return fmt.Errorf("failed to read asset private properties hash from receiver's collection: %v", err)
	}
	if immutableHash == nil {
		return fmt.Errorf("asset private properties hash does not exist: %s", assetID)
	}

	myHash, err := ctx.GetStub().GetPrivateDataHash(collectionSender, assetID)
	if err != nil {
		return fmt.Errorf("failed to read asset private properties hash from sender's collection: %s %v", assetID, err)
	}

	if !bytes.Equal(immutableHash, myHash) {
		return fmt.Errorf("hash %x for passed immutable properties does not match on-chain hash %x",
			myHash,
			immutableHash,
		)
	}

	return nil
}

func transferAssetState(ctx contractapi.TransactionContextInterface,
	asset *Asset,
	clientMSPID string,
	buyerOrgID string) error {

	asset.Owner = buyerOrgID
	updatedAsset, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(asset.ID, updatedAsset)
	if err != nil {
		return fmt.Errorf("failed to write asset for buyer: %v", err)
	}

	collectionSender := clientMSPID + "PrivateCollection"
	err = ctx.GetStub().DelPrivateData(collectionSender, asset.ID)
	if err != nil {
		return fmt.Errorf("failed to delete Asset private details from seller: %v", err)
	}

	return nil
}

func transferAssetResposibilityState(ctx contractapi.TransactionContextInterface,
	asset *Asset,
	clientMSPID string,
	buyerOrgID string) error {

	asset.Responsibility = buyerOrgID
	updatedAsset, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(asset.ID, updatedAsset)
	if err != nil {
		return fmt.Errorf("failed to write asset for buyer: %v", err)
	}

	collectionSender := clientMSPID + "PrivateCollection"
	err = ctx.GetStub().DelPrivateData(collectionSender, asset.ID)
	if err != nil {
		return fmt.Errorf("failed to delete Asset private details from seller: %v", err)
	}

	return nil
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		log.Panicf("error creating chaincode: %v", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("error starting chaincode: %v", err)
	}
}
