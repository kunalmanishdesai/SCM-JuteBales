package main
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
type Bales struct {
	Manufacture_date   string `json:"manufacture_date"`
	Manufacturer  string `json:"manufacturer"`
	Owner string `json:"owner"`
	Buying_date  string `json:"buying date"`
	Is_verified  string `json:"is_verified"`
	Price  string `json:"price"`
	Reed_length  string `json:"reed_length"`
	Strenth  string `json:"Strenth"`
	Defects  string `json:"defects"`
	Root_content  string `json:"root_content"`
	Fineness  string `json:"fineness"`
	Colour  string `json:"colour"`
	Inspected string `json:"inspected"`
	Total_score string `json:"total_score"`
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryBale" {
		return s.queryBale(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createBale" {
		return s.createBale(APIstub, args)
	} else if function == "queryAllBales" {
		return s.queryAllBales(APIstub)
	} else if function == "changeBaleOwner" {
		return s.changeBaleOwner(APIstub, args)
	} else if function == "verifiedBale" {
		return s.verifiedBale(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryBale(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	baleAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(baleAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	bales := []Bale{
		Car{Manufacture_date: "22/10/2020", Manufacturer: "Lucius", Owner: "Lucius", Buying_date:"00/00/0000", Is_verified:"no", Price:"1,50,000", Reed_length:"100", Strength:"1", Defects:"3", Root_content:"3", Fineness:"1", Colour:"2", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "21/11/2020", Manufacturer: "Magnus", Owner: "Magnus", Buying_date:"00/00/0000", Is_verified:"no", Price:"2,15,000", Reed_length:"103", Strength:"2", Defects:"2", Root_content:"4", Fineness:"1", Colour:"3", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "17/07/2020", Manufacturer: "Archie", Owner: "Archie", Buying_date:"00/00/0000", Is_verified:"no", Price:"3,75,000", Reed_length:"108", Strength:"3", Defects:"2", Root_content:"2", Fineness:"2", Colour:"4", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "16/08/2020", Manufacturer: "Monroe", Owner: "Monroe", Buying_date:"00/00/0000", Is_verified:"no", Price:"1,20,000", Reed_length:"102", Strength:"3", Defects:"3", Root_content:"4", Fineness:"3", Colour:"1", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "07/07/2019", Manufacturer: "Lucius", Owner: "Lucius", Buying_date:"00/00/0000", Is_verified:"no", Price:"2,50,000", Reed_length:"104", Strength:"2", Defects:"2", Root_content:"1", Fineness:"2", Colour:"4", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "17/08/2020", Manufacturer: "Archie", Owner: "Archie", Buying_date:"00/00/0000", Is_verified:"no", Price:"1,00,000", Reed_length:"100", Strength:"1", Defects:"4", Root_content:"3", Fineness:"4", Colour:"2", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "31/12/2020", Manufacturer: "Monroe", Owner: "Monroe", Buying_date:"00/00/0000", Is_verified:"no", Price:"1,98,000", Reed_length:"101", Strength:"1", Defects:"4", Root_content:"1", Fineness:"4", Colour:"3", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "03/04/2020", Manufacturer: "Magnus", Owner: "Magnus", Buying_date:"00/00/0000", Is_verified:"no", Price:"5,50,000", Reed_length:"150", Strength:"5", Defects:"1", Root_content:"1", Fineness:"5", Colour:"3", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "03/03/2020", Manufacturer: "Archie", Owner: "Archie", Buying_date:"00/00/0000", Is_verified:"no", Price:"3,50,000", Reed_length:"125", Strength:"4", Defects:"3", Root_content:"3", Fineness:"2", Colour:"1", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "20/01/2020", Manufacturer: "Magnus", Owner: "Magnus", Buying_date:"00/00/0000", Is_verified:"no", Price:"4,75,000", Reed_length:"142", Strength:"4", Defects:"1", Root_content:"1", Fineness:"3", Colour:"3", Inspected:"n/a", Total_score:"0"},
		Car{Manufacture_date: "22/04/2020", Manufacturer: "Lucius", Owner: "Lucius", Buying_date:"00/00/0000", Is_verified:"no", Price:"2,20,000", Reed_length:"114", Strength:"2", Defects:"3", Root_content:"3", Fineness:"2", Colour:"2", Inspected:"n/a", Total_score:"0"},
		
	}

	i := 0
	for i < len(cars) {
		fmt.Println("i is ", i)
		carAsBytes, _ := json.Marshal(cars[i])
		APIstub.PutState("CAR"+strconv.Itoa(i), carAsBytes)
		fmt.Println("Added", cars[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createBale(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 15 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var bale = Bale{Manufacture_date: args[1], Manufacturer: args[2], Owner: args[3], Buyingdate: args[4], Is_verified: args[5], Price: args[6], Reed_length: args[7],Strength: args[8],
		Defects: args[9],Root_content: args[10],Fineness: args[11],Colour: args[12],Inspected: args[13],Total_score: args[14]}

	baleAsBytes, _ := json.Marshal(bale)
	APIstub.PutState(args[0], baleAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryAllBales(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "BALE0"
	endKey := "BALE999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllBales:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) changeBaleOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	baleAsBytes, _ := APIstub.GetState(args[0])
	balea := Bale{}

	json.Unmarshal(baleAsBytes, &bale)
	bale.Owner = args[1]

	baleAsBytes, _ = json.Marshal(bale)
	APIstub.PutState(args[0], baleAsBytes)

	return shim.Success(nil)
}



//verification
func (s *SmartContract) verifiedBale(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	baleAsBytes, _ := APIstub.GetState(args[0])
	bale := Bale{}

	json.Unmarshal(baleAsBytes, &bale)
	bale.Is_verified = args[1]

	json.Unmarshal(baleAsBytes, &bale)
	bale.Inspected = args[2]

	json.Unmarshal(baleAsBytes, &bale)
	bale.Total_score = args[3]

	baleAsBytes, _ = json.Marshal(bale)
	APIstub.PutState(args[0], baleAsBytes)

	return shim.Success(nil)
}




// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}