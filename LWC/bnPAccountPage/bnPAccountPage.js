import { LightningElement } from 'lwc';
import getRecentSearchDealer from "@salesforce/apex/USAutoBPAccountPageController.getRecentSearchDealerAccounts";
import getAllDealerAccountForSearch from "@salesforce/apex/USAutoBPAccountPageController.getAllDealerAccountForSearch";
import getAllPayeeAccountForSearch from "@salesforce/apex/USAutoBPAccountPageController.getAllPayeeAccountForSearch";
import runProcessMissingClientFeePayeeBatch from '@salesforce/apex/USAutoBPAccountPageController.runProcessMissingClientFeePayeeBatch';
import getAccountsByClassificationCode from '@salesforce/apex/USAutoBPAccountPageController.getAccountsByClassificationCode';
import getDealerProductsByDealer from '@salesforce/apex/USAutoBPAccountPageController.getDealerProductsByDealer';
import Billing_and_Payment_Dealer_and_Payee_Account from '@salesforce/label/c.Billing_and_Payment_Dealer_and_Payee_Account';
import Dealer_Search from '@salesforce/label/c.Dealer_Search';
import Payee_Search from '@salesforce/label/c.Payee_Search';
import Enter_value_for_search from '@salesforce/label/c.Enter_value_for_search';
import Payee_Accounts from '@salesforce/label/c.Payee_Accounts';
import Dealer_Accounts from '@salesforce/label/c.Dealer_Accounts';
import Recent_Dealer_Accounts from '@salesforce/label/c.Recent_Dealer_Accounts';
import Unable_to_execute_Agreements_Without_Payee from '@salesforce/label/c.Unable_to_execute_Agreements_Without_Payee';
import Agreements_without_payee_job from '@salesforce/label/c.Agreements_without_payee_job';
import Insufficient_Privileges from '@salesforce/label/c.Insufficient_Privileges';
import Classification_Code from '@salesforce/label/c.Classification_Code';
import Close from '@salesforce/label/c.CPM_Close';
import CPM_Product_Id from '@salesforce/label/c.CPM_Product_Id';
import Contract_Type from '@salesforce/label/c.CPM_Contract_Type';
import Product_Code_INT from '@salesforce/label/c.ProductCode_INT_Text';
import Product_Class from '@salesforce/label/c.CPM_Product_Class';
import Status_Active from '@salesforce/label/c.Status_Active';
import Visible_For_Quoting from '@salesforce/label/c.Visible_for_Quoting';
import Start_Date from '@salesforce/label/c.Text_Start_Date';
import End_Date from '@salesforce/label/c.Text_End_Date';
import Stop_Date from '@salesforce/label/c.Stop_Date';
import NUG_INT from '@salesforce/label/c.Nug_Int'; 
import Dealer_Products from '@salesforce/label/c.CPM_Dealer_Products';
import Products from '@salesforce/label/c.Products';
import Client_Fee_Maintenance from '@salesforce/label/c.Client_Fee_Maintenance';
import Client_Fee_Payment from '@salesforce/label/c.Client_Fee_Payment';
import {loadStyle} from 'lightning/platformResourceLoader';
import BnPCustomCss from '@salesforce/resourceUrl/AutoBPAccountPageCss';
import getPermissionSetForLoggedInUserByName from '@salesforce/apex/USAutoBPAccountPageController.getPermissionSetForLoggedInUserByName';
import Manual_Dealer_Refund_Not_Allowed_When_Auto_Check_True from '@salesforce/label/c.Manual_Dealer_Refund_Not_Allowed_When_Auto_Check_True';
import Text_You_Do_Not_Have_Permissions_To_Perform_This_Operation from '@salesforce/label/c.Text_You_Do_Not_Have_Permissions_To_Perform_This_Operation';
import Balance from '@salesforce/label/c.Balance';
import Payees from '@salesforce/label/c.Payees';
import You_are_not_authorized_to_create_Client_fee_Payment from '@salesforce/label/c.You_are_not_authorized_to_create_Client_fee_Payment';
import CPM_Edit from '@salesforce/label/c.CPM_Edit';
import Invoke_Accounting_Action from '@salesforce/label/c.Invoke_Accounting_Action';
import Statement from '@salesforce/label/c.Statement';
import Client_Fee_Balance from '@salesforce/label/c.Client_Fee_Balance';
import Contract_Client_Fee from '@salesforce/label/c.Contract_Client_Fee';
import Statements from '@salesforce/label/c.Statements';
import Client_Fee_Product_Allocation from '@salesforce/label/c.Client_Fee_Product_Allocation';
import You_are_not_authorized_to_create_Client_fee_Product_Allocations from '@salesforce/label/c.You_are_not_authorized_to_create_Client_fee_Product_Allocations';
import action from '@salesforce/label/c.Action';
import RDTranscation from '@salesforce/label/c.RD_Transaction'; 
import dealer from '@salesforce/label/c.Dealer';
import getListOfRelatedDealersForPayee from '@salesforce/apex/USAutoBPAccountPageController.getListOfRelatedDealersForPayee';
import DealerNumber from '@salesforce/label/c.DMA_DealerNumber';
import DealerName from '@salesforce/label/c.Dealer_Name';
import DealerStatus from '@salesforce/label/c.Dealer_Status';
import NetInvoices from '@salesforce/label/c.Net_Invoices';
const Dealer_Refund_Action_Name='DealerRefund';
const ThirdParty_Refund_Action_Name='ThirdPartyRefund';
const permissionSetNameBPClientServiceAnalyst='BP_Client_Service_Analyst';
const permissionSetClientFeePayeeMaintenance='Client_Fee_Payee_Maintenance';
const ClientFeeMaintenanceAction='apex/ClientFeeMaintenanceAction?id=';
const protocolHostSeparator="//";
const PayeeActionUrl='apex/LwcAuraContainer?moduleType=DealerPayees&recordId=';
const urlSeparator="/";
const editModeIndentified="/e?retURL=";
const InvokeAccountingAction='apex/InvokeAccountingAction?scontrolCaching=1&id=';
const DealerActionFromBnPAccountPage = '&isDealerActionFromBnPAccountPage=';
const isDealerAction = 'true';
const statementActionUrl = 'apex/LwcAuraContainer?moduleType=PayeeStatements&recordId=';
const statementDealerActionUrl = 'apex/LwcAuraContainer?moduleType=DealerStatements&recordId=';
const clientFeeStatementActionUrl = 'apex/LwcAuraContainer?moduleType=ClientFeeStatements&recordId=';
const clientFeeProductAllocationUrl = 'apex/LwcAuraContainer?moduleType=ClientFeeProductAllocation&recordId=';
const payeeDealerstatementUrl = 'apex/LwcAuraContainer?moduleType=PayeeDealerStatements&recordId=';
const rdTranscationActionUrl = 'apex/LwcAuraContainer?moduleType=RDTranscations';
export default class BnPAccountPage extends LightningElement {
    selectedValue = 'Dealer';
    isDealer = true;
    isPayee = false;
    isClassificationCode = false;
    searchInput;
    isDefaultTable = false;
    isDealerTable = false;
    isPayeeTable = false;
    baseURL;
    recordList;
    loadingSpinner = true;
    displayTitle;
    placeholder= 'Enter Name or Account Number';
    isbatchrunning = false;
    jobScheduled = false;
    isInsufficiantAccess = false;
    dealerProductRecordList;
    isDealerProductModalOpen = false;
    isPayeeDealerModalOpen = false;
    PayeeDealerRecordList;
    dealerAccount='';
	
    label = {
        Billing_and_Payment_Dealer_and_Payee_Account,
        Payee_Search,
        Dealer_Search,
        Enter_value_for_search,
        Payee_Accounts,
        Dealer_Accounts,
        Recent_Dealer_Accounts,
        Unable_to_execute_Agreements_Without_Payee,
        Agreements_without_payee_job,
        Insufficient_Privileges,
        Classification_Code,
        Close,
        CPM_Product_Id,
        Contract_Type,
        Product_Code_INT,
        Product_Class,
        Status_Active,
        Visible_For_Quoting,
        Start_Date,
        End_Date,
        Dealer_Products,
        Stop_Date,
        NUG_INT,
        Products,
        Client_Fee_Maintenance,
        Balance,
        Client_Fee_Payment,
        You_are_not_authorized_to_create_Client_fee_Payment,
        Payees,
        CPM_Edit,
        Invoke_Accounting_Action,
        Statement,
        Client_Fee_Balance,
        Contract_Client_Fee,
        Statements,
        Client_Fee_Product_Allocation,
        You_are_not_authorized_to_create_Client_fee_Product_Allocations,
        action,
        RDTranscation,
        dealer,
        DealerNumber,
        DealerName,
        DealerStatus,
        NetInvoices
    };
    
    dealerActions = [
        { label: 'Payees', name: 'Payees'},
        { label: 'Products', name: 'Products'},
        { label: this.label.Balance, name:this.label.Balance},
        { label: 'Statement', name:'Statement'},
        { label: this.label.Client_Fee_Balance, name:this.label.Client_Fee_Balance},
        { label: this.label.Contract_Client_Fee +' '+  this.label.Statements, name:this.label.Contract_Client_Fee +' '+  this.label.Statements},
        { label: this.label.Invoke_Accounting_Action, name:this.label.Invoke_Accounting_Action},
        { label: 'Dealer Refund', name:'DealerRefund'},
        { label: 'Third Party Refund', name:'ThirdPartyRefund'},
        { label: this.label.Client_Fee_Maintenance, name: this.label.Client_Fee_Maintenance},
        { label: this.label.NetInvoices, name: this.label.NetInvoices}
    ];

    dealerColumns = [
        {label: 'Client Number', fieldName: 'clientNumberurl', type: 'url',
        typeAttributes: 
        {label: { fieldName: 'clientNumber' }, target: '_blank'}},
        { label: 'Name', fieldName: 'name', type: 'text'},
        { label: 'Client Status', fieldName: 'clientStatus', type: 'text'},
        { label: 'Action', type: 'action', typeAttributes: { rowActions: this.dealerActions }, initialWidth: 100}
    ];

    payeeActions = [
        { label: this.label.CPM_Edit, name: this.label.CPM_Edit},
        { label: 'Balance', name:'Balance'},
        { label: this.label.Statement, name:this.label.Statement},
        { label: this.label.Invoke_Accounting_Action, name: this.label.Invoke_Accounting_Action},
        { label: this.label.Client_Fee_Payment, name: this.label.Client_Fee_Payment},
        { label: this.label.dealer, name: this.label.dealer}
    ];

    payeesColumns = [
        {label: 'Payee Number', fieldName: 'payeeNumberurl', type: 'url',
        typeAttributes: {label: { fieldName: 'Payee_Number__c' }, target: '_blank'}},
        { label: 'Payee Name', fieldName: 'Name', type: 'text' },
        { label: 'Payee Status', fieldName: 'Status__c', type: 'text' },
        { label: 'Freeze Payee', fieldName: 'Freeze_Client_Fees__c', type: 'boolean' },
        { label: 'Action', type: 'action', typeAttributes: { rowActions: this.payeeActions } }
    ];

    productActions = [
        { label: this.label.Client_Fee_Product_Allocation, name:this.label.Client_Fee_Product_Allocation}
    ];
	
    dealerProductColumns = [
        {label: this.label.CPM_Product_Id, fieldName: 'dealerProductUrl', type: 'url', wrapText: true,
         typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}, initialWidth:110},
        {label: this.label.Contract_Type, fieldName: 'ProductClassDesc_INT__c', wrapText: true, initialWidth:130},
        {label: this.label.Product_Code_INT, fieldName: 'ProductCode_INT__c', initialWidth:150},
        {label: this.label.Product_Class, fieldName: 'Product_Class__c', wrapText: true, initialWidth:150},
        {label: this.label.Status_Active, fieldName: 'Active__c', type: 'boolean',
         cellAttributes: { alignment: 'center' }},
        {label: this.label.Visible_For_Quoting, fieldName: 'Visible_for_Quoting__c', type: 'boolean', initialWidth:150,
         cellAttributes: { alignment: 'center' }},
        {label: this.label.Start_Date, fieldName: 'Start_Date__c', type: 'date', 
         typeAttributes: {day: "numeric", month: "numeric", year: "numeric"}, hideDefaultActions: true},
        {label: this.label.Stop_Date, fieldName: 'Stop_Date__c', type: 'date',
         typeAttributes: {day: "numeric", month: "numeric", year: "numeric"}, hideDefaultActions: true},
        {label: this.label.End_Date, fieldName: 'End_Date__c', type: 'date',
         typeAttributes: {day: "numeric", month: "numeric", year: "numeric"}, hideDefaultActions: true},
        {label: this.label.NUG_INT, fieldName: 'NUG_INT__c', hideDefaultActions: true},
        { label: this.label.action, type: 'action', typeAttributes: { rowActions: this.productActions }, initialWidth: 100 }
    ];

    payeeDealerActions=[
        { label: this.label.Statement, name:this.label.Statement },
        { label: this.label.RDTranscation , name:this.label.RDTranscation }
    ];

    dealerPayeesColumns = [
        {
            label: this.label.DealerNumber, fieldName: 'payeeDealerUrl', type: 'url',
            typeAttributes: { label: { fieldName: 'AccountNumber' }, target: '_blank' }
        },
        { label: this.label.DealerName, fieldName: 'Name', type: 'text' },
        { label: this.label.DealerStatus, fieldName: 'Client_Status_Formula__c', type: 'text' },
        { label: this.label.action, type: 'action', typeAttributes: { rowActions: this.payeeDealerActions }, initialWidth: 100 }
    ];

    get options() {
        return [
            { label: 'Dealer', value: 'Dealer'},
            { label: 'Payee', value: 'Payee' },
            { label: 'Dealer Search By Classification Code', value: 'ClassificationCode'},
        ];
    }

    connectedCallback() {
        this.baseURL = window.location.href.split("/")[2] + '/';
        this.fetchRecentDealerAccount();
        Promise.all([
            loadStyle(this, BnPCustomCss)
        ])
    }
    
    async handleRowAction(event)
    {
        const actionNamesWithoutPermission=[this.label.Balance, this.label.Products, this.label.Payees, this.label.Client_Fee_Maintenance, this.label.Client_Fee_Payment, this.label.CPM_Edit,
            this.label.Invoke_Accounting_Action, this.label.Statement, this.label.Client_Fee_Balance, this.label.Contract_Client_Fee +' '+  this.label.Statements, this.label.RDTranscation, this.label.dealer, this.label.NetInvoices];
        this.selectedAccountRecord=event.detail.selectedRecord;
        const actionName=event.detail.actionName;
        if(actionNamesWithoutPermission.includes(actionName)){
            switch(actionName)
            {
                case this.label.Balance:
                    if (this.isPayeeTable == true) {
                        this.template.querySelector("c-payee-balance").formSetUpForAction(this.selectedAccountRecord.recordId ? this.selectedAccountRecord.recordId : this.selectedAccountRecord.Id, false, null);
                    } else {
                        this.template.querySelector("c-dealer-balance").formSetUpForAction(this.selectedAccountRecord.recordId ? this.selectedAccountRecord.recordId : this.selectedAccountRecord.Id);
                    }
                    break;
                case this.label.Products:
                    await this.openDealerProductModal(this.selectedAccountRecord.recordId);
                    break;
                case this.label.Payees:
                    window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + PayeeActionUrl + this.selectedAccountRecord.recordId, "_blank");
                    break; 
                case this.label.Client_Fee_Maintenance:
                    const permissionSet= await getPermissionSetForLoggedInUserByName({permissionSetName : permissionSetClientFeePayeeMaintenance})
                    if( permissionSet.length===0 ){
                        alert(Text_You_Do_Not_Have_Permissions_To_Perform_This_Operation);
                        return;
                    }
                    window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + ClientFeeMaintenanceAction + this.selectedAccountRecord.recordId, "_blank");
                    break;
                case this.label.Client_Fee_Payment:
                    const clientFeePermissionSet= await getPermissionSetForLoggedInUserByName({permissionSetName : permissionSetClientFeePayeeMaintenance})
                    if( clientFeePermissionSet.length===0 ){
                        alert(this.label.You_are_not_authorized_to_create_Client_fee_Payment);
                        return;
                    }
                    this.template.querySelector("c-refund-case-payee-creation").formSetUpForAction(this.selectedAccountRecord.Id, actionName);
                    break;  
                case this.label.CPM_Edit:
                    window.open(urlSeparator + this.selectedAccountRecord.Id + editModeIndentified + this.selectedAccountRecord.Id, "_blank")
                    break; 
                case this.label.Invoke_Accounting_Action:
                    if(this.isPayee){
                        window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + InvokeAccountingAction + this.selectedAccountRecord.Id, "_blank");
                    }
                    else{
                        window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + InvokeAccountingAction + this.selectedAccountRecord.recordId + 
                            DealerActionFromBnPAccountPage + isDealerAction, "_blank");
                    }
                    break;
                case this.label.Statement:
                    if(this.isPayee && !this.isPayeeDealerModalOpen){
                        window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + statementActionUrl + this.selectedAccountRecord.Id,  "_blank");
                    }
                    if(this.isDealer || this.isClassificationCode){
                        window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + statementDealerActionUrl + this.selectedAccountRecord.recordId,  "_blank");
                    }
                    if(this.isPayee && this.isPayeeDealerModalOpen){
                        window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + payeeDealerstatementUrl + this.dealerAccount +'&accId='+ this.selectedAccountRecord.Id,  "_blank");
                    }
                    break;
                case this.label.Client_Fee_Balance:
                    this.template.querySelector("c-client-fee-balance").formSetUpForAction(this.selectedAccountRecord.recordId ? this.selectedAccountRecord.recordId : this.selectedAccountRecord.Id);
                    break;
                case this.label.Contract_Client_Fee +' '+  this.label.Statements:
                    window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + clientFeeStatementActionUrl + this.selectedAccountRecord.recordId,  "_blank");
                    break;
                case this.label.dealer:
                    this.dealerAccount= this.selectedAccountRecord.Id;
                    await this.openDealerModal(this.selectedAccountRecord.Id);
                    break;
                case this.label.RDTranscation:
                    if(this.isPayee){
                        window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + rdTranscationActionUrl +'&recordId='+ this.selectedAccountRecord.Id +'&PayeeId='+ this.dealerAccount,  "_blank");
                    }
                    break;
                case this.label.NetInvoices:
                    this.template.querySelector("c-net-invoices").openModal();   
                break;
            }
        }
        else{         
            const permissionSet= await getPermissionSetForLoggedInUserByName({permissionSetName : permissionSetNameBPClientServiceAnalyst})
            if(permissionSet && permissionSet.length>0){
                alert(Text_You_Do_Not_Have_Permissions_To_Perform_This_Operation);
                return;
            }
            switch(actionName)
            {
                case Dealer_Refund_Action_Name:
                    const accountCheckExistsForSelectedRecord= this.recordList.some(e=>
                    e.recordId === this.selectedAccountRecord.recordId && e.autoCheck==true);
                    if(accountCheckExistsForSelectedRecord){
                        alert(Manual_Dealer_Refund_Not_Allowed_When_Auto_Check_True);
                        return;
                    }
                    this.template.querySelector("c-refund-case-payee-creation").formSetUpForAction(this.selectedAccountRecord.recordId,actionName);   
                    break;
                case ThirdParty_Refund_Action_Name:
                    this.template.querySelector("c-refund-case-payee-creation").formSetUpForAction(this.selectedAccountRecord.recordId,actionName);
                    break;
                case this.label.Client_Fee_Product_Allocation:
                   const clientFeeProductAllocationPermissionSet = await getPermissionSetForLoggedInUserByName({ permissionSetName: permissionSetClientFeePayeeMaintenance })
                   if (clientFeeProductAllocationPermissionSet.length === 0){
                        alert(this.label.You_are_not_authorized_to_create_Client_fee_Product_Allocations);
                        return;
                    }
                    window.open(window.location.protocol+ protocolHostSeparator + this.baseURL + clientFeeProductAllocationUrl + this.selectedAccountRecord.Id,  "_blank");
                    break;
            }
        }
    }
    
    fetchRecentDealerAccount() {
        getRecentSearchDealer()
        .then((result) => {
            if(result != null){
                this.recordList = result;
                this.recordList.forEach(record => {
                    record.clientNumberurl = this.baseURL + record.recordId;  
                });
            }else{
                this.recordList = '';
            }
            this.error = undefined;
            this.displayTitle = this.label.Recent_Dealer_Accounts;
            this.isDefaultTable = true;
            this.loadingSpinner = false;
        })
        .catch((error) => {
            this.error = error;
            this.data = undefined;
        });
    }
    
    handleRadioButtonChange(event) {
        this.selectedValue = event.detail.value;
        if(this.selectedValue == 'Payee'){
            this.isDealer = false;
            this.isClassificationCode = false;
            this.isPayee = true;
            this.placeholder = 'Enter Name or Number';
        }else if(this.selectedValue == 'Dealer'){
            this.isDealer = true;
            this.isPayee = false;
            this.isClassificationCode = false;
            this.placeholder = 'Enter Name or Account Number';
        }else{
            this.isPayee = false;
            this.isDealer = false;
            this.isClassificationCode = true;
            this.placeholder = 'Enter Classification Code';
        }
    }

    handleChange(event){
      this.searchInput = event.detail.value;
    }

    handleSearch(){
        const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputField) => {
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            }, true);
        if (isInputsCorrect) {
            this.selectedAccountRecord=null;
            if(this.searchInput.length > 1){
                this.loadingSpinner = true;
                if(this.isDealer == true){
                    this.fetchDealerAccounts();
                }else if(this.isPayee){
                    this.fetchPayeeAccounts();
                }else{
                    this.fetchAccountByClassificationCode();
                }
            }
        }
        
    }

    fetchDealerAccounts(){
        this.isDealerTable = false;
        getAllDealerAccountForSearch({searchKey : this.searchInput})
        .then((result) => {
            if(result != null){
                this.recordList = result;
                this.recordList.forEach(record => {
                    record.clientNumberurl = this.baseURL + record.recordId;  
                });
            }else{
                this.recordList = '';
            }
            this.displayTitle = this.label.Dealer_Accounts;
            this.isPayeeTable = false;
            this.isDefaultTable = false;
            this.isDealerTable = true;
            this.loadingSpinner = false;
            this.error = undefined;
        })
        .catch((error) => {
            this.loadingSpinner = false;
            this.error = error;
            this.data = undefined;
        });
    }

    fetchPayeeAccounts(){
        this.isPayeeTable = false;
        getAllPayeeAccountForSearch({searchKey : this.searchInput})
        .then((result) => {
            this.recordList = result;
            this.recordList.forEach(record => {
                record.payeeNumberurl = this.baseURL + record.Id;  
            });
            this.displayTitle = this.label.Payee_Accounts;
            this.isDefaultTable = false;
            this.isDealerTable = false;
            this.isPayeeTable = true;
            this.loadingSpinner = false;
            this.error = undefined;
        })
        .catch((error) => {
            this.loadingSpinner = false;
            this.error = error;
            this.data = undefined;
        });
    }

    fetchAccountByClassificationCode(){
        this.isDealerTable = false;
        getAccountsByClassificationCode({searchKey : this.searchInput})
        .then((result) => {
            if(result != null){
                this.recordList = result;
                this.recordList.forEach(record => {
                    record.clientNumberurl = this.baseURL + record.recordId;  
                });
            }else{
                this.recordList = '';
            }
            this.displayTitle = this.label.Dealer_Accounts;
            this.isPayeeTable = false;
            this.isDefaultTable = false;
            this.isDealerTable = true;
            this.loadingSpinner = false;
            this.error = undefined;
        })
        .catch((error) => {
            this.loadingSpinner = false;
            this.error = error;
            this.data = undefined;
        });
    }
	
    async openDealerProductModal(dealerId){
        this.loadingSpinner = true;
        try{
            this.dealerProductRecordList= await getDealerProductsByDealer({dealerId : dealerId})
            this.dealerProductRecordList.forEach(record => {
                record.dealerProductUrl = this.baseURL + record.Id;
                record.startDateSortable=record.Start_Date__c? new Date(record.Start_Date__c):new Date(null);    
            });
            this.dealerProductRecordList.sort((a,b)=>b.startDateSortable - a.startDateSortable);
            this.isDealerProductModalOpen = true; 
        }
        catch(e){
            this.error = error;
            this.data = undefined;
        }
        finally{
          this.loadingSpinner = false;
        }
    }
	
    closeDealerProductModal() {
       this.isDealerProductModalOpen = false;
    }
	
    runbatch(){
        this.loadingSpinner = true;
        runProcessMissingClientFeePayeeBatch()
        .then((result) => {
            if(result == 'Running'){
                this.jobScheduled = false;
                this.isInsufficiantAccess = false;
                this.isbatchrunning = true;
            }else if(result == 'Scheduled'){
                this.isbatchrunning = false;
                this.isInsufficiantAccess = false;
                this.jobScheduled = true;
            }
            else if(result == 'Insufficiant Access'){
                this.isbatchrunning = false;
                this.jobScheduled = false;
                this.isInsufficiantAccess = true;
            }
            this.loadingSpinner = false;
        })
        .catch((error) => {
            this.loadingSpinner = false;
            this.error = error;
            this.data = undefined;
        });
    }

    handleclose(){
        this.isbatchrunning = false;
        this.jobScheduled = false;
        this.isInsufficiantAccess = false;
    }

    async openDealerModal(payeeId) {
        try{
            this.PayeeDealerRecordList= await getListOfRelatedDealersForPayee({payeeId : payeeId})
            this.PayeeDealerRecordList.forEach(record => {
                record.payeeDealerUrl = this.baseURL + record.Id;
            });
            this.isPayeeDealerModalOpen = true;
        }
        catch(e){
            this.error = error;
            this.data = undefined;
        }
        finally{
          this.loadingSpinner = false;
        }
    }

    closePayeeDealerAccountModal() {
        this.isPayeeDealerModalOpen = false;
     }
}