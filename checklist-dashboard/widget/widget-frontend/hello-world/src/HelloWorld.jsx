import React, { Component, Children, version } from 'react';

import { MuiThemeProvider, withStyles} from '@material-ui/core/styles';

import { FormControl, InputLabel, Select, MenuItem, FilledInput, Tooltip, createMuiTheme } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import appendQuery from 'append-query';

const hostUrl = "https://" + window.location.host + window.contextPath + "/apis/checklist";


const styles = theme => ({
    root: {
        paddingBottom : '70px'
    }    
});

const PageWrapper_style = {
    padding : '30px',
    background : 'transparent',
    boxShadow : 'none'
};

const SelectDiv_style = {
    overflowX: "auto",
    padding : '20px'
};

const FormControl_style = {
    width : '47%',
    display : 'flex',
    wrap : 'nowrap',
    float : 'Left',
    margin : '10px'
};

const TableDiv_style = {
    overflowX: "auto",
};

const TableHeadCell_style = {
    border : '1px solid rgba(0, 0, 0, 0.1)',
    padding : '5px 7px',
    borderRadius : '3px',
    fontSize : '14px',
    fontWeight : 'normal',
    outline : 'none',
    textAlign : 'center'
};

const TableBorder_style = {
    border: "2px solid #aaa",
    overflow: "auto"
};

class HelloWorld extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selected_ProductName: '',
            productNameList: [],
            selected_ProductVersion: '',
            productVersionList: [],
            dependencySummary : '',
            codeCoverage : '',
            gitIssues : '',
            mergedPRCount : '',
            jiraPerf : '',
            jiraSecScan : '',
            jiraCommitment : '',
            jiraSecCust : '',
            jiraSecExt : '',
            jiraSecInt : '',
        };

        this.handleChange_ProductName = event => {
            this.setState ({ [event.target.name] : event.target.value });
            this.setState({
                selected_ProductName : event.target.value
            }, function () {
                console.log("STATE :: Selected Product Name :");
                console.log(this.state.selected_ProductName);
            });   
        };

        this.handleChange_ProductVersion = event => {
            this.setState ({ [event.target.name] : event.target.value });
            this.setState ({ 
                selected_ProductVersion : event.target.value
            },function () {
                console.log("STATE :: Selected Version Title : " + this.state.selected_ProductVersion.versionTitle);
                console.log("STATE :: Selected Version Number : " + this.state.selected_ProductVersion.versionNumber);
            });
        }
    }

    componentDidMount() {
        const getProductNamesURL = hostUrl + '/products';
        //const getProductNamesURL = "https://www.mocky.io/v2/5cbed162300000b9069ce2d1";
       
        axios.create({
            withCredentials:false,
        })
        .get(getProductNamesURL)
        .then(
            res => {
                var response = res.data;

                let productsFromApi = response.products.map(products => {
                    return {productName : products}
                });

                this.setState({productNameList : productsFromApi }, function () {
                    console.log("State :: Product Name list : ");
                    console.log(this.state.productNameList)
                });
            })
        .catch(error => {
            console.log(error)
        });           
         
    } //End of componentDidMount

    componentDidUpdate(prevProps, prevState) {
        if(this.state.selected_ProductName !== prevState.selected_ProductName) {
            console.log("Product Name has changed")            
            let versionURL = hostUrl + '/versions/' + this.state.selected_ProductName;
            //let versionURL = "https://www.mocky.io/v2/5cbed19d300000ba069ce2d3";
            axios.create({
                withCredentials : false,
            })
            .get(versionURL)
            .then( 
                res => {
                    var response = res.data;
                    let versionsFromApi = response.versions.map(
                        versions => {
                            return { versionTitle : versions.title, versionNumber : versions.number }
                        }
                    );

                    this.setState({productVersionList : versionsFromApi.map(
                        versionsFromApi => ({
                            versionTitle : versionsFromApi.versionTitle,
                            versionNumber : versionsFromApi.versionNumber
                        }))
                    }, function () {
                        console.log("State :: Product Version list : ");
                        console.log(this.state.productVersionList);
                    })
                }

            )
            .catch(error => {
                console.log(error);
            });
        }

        if(this.state.selected_ProductVersion !== prevState.selected_ProductVersion) {
            console.log("Product version has changed");
            let infoVersion = { version : this.state.selected_ProductVersion.versionNumber }
            let infoTitle = { version : this.state.selected_ProductVersion.versionTitle }
    
            let dependencyURL = hostUrl + '/dependency/' + this.state.selected_ProductName;
            console.log("Dependency URL :" + dependencyURL);

            let codeCoverageURL = hostUrl + '/codeCoverage/' + this.state.selected_ProductName;
            console.log("Code Coverage URL :" +codeCoverageURL);

            let gitIssuesURL = hostUrl + '/gitIssues/' + this.state.selected_ProductName;
            gitIssuesURL = appendQuery(gitIssuesURL, infoVersion);
            console.log("Git Issues URL :" +gitIssuesURL);
            
            let mergedPRCountURL = hostUrl + '/mprCount/' + this.state.selected_ProductName;    
            mergedPRCountURL = appendQuery(mergedPRCountURL, infoTitle);
            console.log("Merged PR URL :" +mergedPRCountURL);

            let jiraIssueTypes = ['perf-report', 'sec-scan', 'commitment', 'sec-cust', 'sec-ext', 'sec-int'];
            

            //Jira issue : Performance Report
            let infoPerf = {  version : selected_ProductVersion.versionNumber, issueType : 'perf-report' }
            let jiraUrl = hostUrl + '/jiraIssues/' + this.state.selected_ProductName;
            jiraUrl = appendQuery(jiraUrl, infoPerf);

            axios.create({
                withCredentials : false,
            })
            .get(jiraUrl)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ jiraPerf : response }, 
                        function() {
                            console.log(this.state.jiraPerf);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Jira issue : Security Scan
            let infoSecScan = {  version : selected_ProductVersion.versionNumber, issueType : 'sec-scan' }
            jiraUrl = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            jiraUrl = appendQuery(jiraUrl, infoSecScan);

            axios.create({
                withCredentials : false,
            })
            .get(jiraUrl)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ jiraSecScan : response }, 
                        function() {
                            console.log(this.state.jiraSecScan);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Jira issue : Customer Commitment
            let infoCommitment = { version : selected_ProductVersion.versionNumber, issueType : 'commitment' }
            jiraUrl = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            jiraUrl = appendQuery(jiraUrl, infoCommitment);

            axios.create({
                withCredentials : false,
            })
            .get(jiraUrl)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ jiraCommitment : response }, 
                        function() {
                            console.log(this.state.jiraCommitment);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Jira issue : Security customer
            let infoSecCust = {  version : selected_ProductVersion.versionNumber, issueType : 'sec-cust' }
            jiraUrl = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            jiraUrl = appendQuery(jiraUrl, infoSecCust);

            axios.create({
                withCredentials : false,
            })
            .get(jiraUrl)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ jiraSecCust : response }, 
                        function() {
                            console.log(this.state.jiraSecCust);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Jira issue : Security External
            let infoSecExt = { version : selected_ProductVersion.versionNumber, issueType : 'sec-ext' }
            jiraUrl = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            jiraUrl = appendQuery(jiraUrl, infoSecExt);

            axios.create({
                withCredentials : false,
            })
            .get(jiraUrl)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ jiraSecExt : response }, 
                        function() {
                            console.log(this.state.jiraSecExt);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Jira issue : Security Internal
            let infoSecInt = {  version : selected_ProductVersion.versionNumber, issueType : 'sec-int' }
            jiraUrl = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            jiraUrl = appendQuery(jiraUrl, infoSecInt);

            axios.create({
                withCredentials : false,
            })
            .get(jiraUrl)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ jiraSecInt : response }, 
                        function() {
                            console.log(this.state.jiraSecInt);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });




            //Dependency Summary
            axios.create({
                withCredentials : false,
            })
            .get(dependencyURL)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ dependencySummary : response }, 
                        function() {
                            console.log(this.state.dependencySummary);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Code coverage
            axios.create({
                withCredentials : false,
            })
            .get(codeCoverageURL)
            .then(
                res => {
                    var response = res.data;
                    this.setState({codeCoverage : response },
                        function() {
                            console.log(this.state.codeCoverage);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            
            //Git issues 
            axios.create({
                withCredentials : false,
            })
            .get(gitIssuesURL)
            .then(
                res => {
                    var response = res.data;
                    this.setState( { gitIssues : response },
                        function() {
                            console.log(this.state.gitIssues);
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

            //Merged PR Count
            axios.create({
                withCredentials : false,
            })
            .get(mergedPRCountURL)
            .then(
                res => {
                    var response = res.data;
                    this.setState({ mergedPRCount : response },
                        function() {
                            console.log(this.state.mergedPRCount);    
                        }
                    );
                }
            ).catch(error => {
                console.log(error);
            });

        }

    }

    render() {
        let reactTheme = createMuiTheme({
            palette : {
                type : this.props.muiTheme.name,
            },
            typography : {
                useNextVariants : true,
            },
        });


        return (
            <MuiThemeProvider theme = {reactTheme}>
                <div style = {PageWrapper_style}>

                    {/* Heading Div */}
                    <div>
                        <h2><center> Release Readiness Metrics? </center></h2>
                    </div>

                    {/* Select Div */}
                    <div style = {SelectDiv_style}>
                        {/* Product Name Select */}
                        <FormControl style = {FormControl_style}>
                            <InputLabel htmlFor = "product-name"> Product Name</InputLabel>
                            <Select
                                value = { this.state.selected_ProductName }
                                onChange = { this.handleChange_ProductName }
                                inputProps = {{ 
                                    name : 'selected_ProductName',
                                    id : 'product-name' 
                                }}
                            >
                                {this.state.productNameList.map(
                                    (product) => <MenuItem value = {product.productName}> {product.productName} </MenuItem> 
                                )}
            
                            </Select>
                        </FormControl>

                        {/* Product Version Select */}
                        <FormControl style = {FormControl_style}>
                            <InputLabel htmlFor = "product-version"> Product Version </InputLabel>
                            <Select
                                value = { this.state.selected_ProductVersion }
                                onChange = { this.handleChange_ProductVersion }
                                inputProps = {{
                                    name : 'selected_ProductVersion',
                                    id : 'product-version'
                                }}
                            >
                                {this.state.productVersionList.map(
                                    (version) => <MenuItem value = {version}> {version.versionTitle} </MenuItem>
                                )}

                            </Select>
                        </FormControl>
                    </div>

                    {/* Table Div */}
                    <div style = {TableDiv_style}>
                        <Table style = {TableBorder_style}>
                            <colgroup>
                                <col style={{width: '10%'}}/>
                                <col style={{width: '60%'}}/>
                                <col style={{width: '30%'}}/>
                            </colgroup>
                        
                            <TableHead>
                                <TableCell> <h3> Status </h3> </TableCell>
                                <TableCell align = "center"> <h3> Metrics </h3> </TableCell>
                                <TableCell> <h3> Progress </h3> </TableCell>
                            </TableHead>
                        
                            <TableBody>
                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the security scan results" placement = "top">
                                            <p>Security Scan Reports</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 
                                            {this.state.jiraSecScan.openIssues } open 
                                        </a> / {this.state.jiraSecScan.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> RED </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the Analysis Report results" placement = "top">
                                            <p>Performance Analysis Report</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 
                                            {this.state.jiraPerf.openIssues } open 
                                        </a> / {this.state.jiraPerf.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows the Customer Commitments" placement = "top">
                                            <p>Customer Commitments</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 
                                            {this.state.jiraCommitment.openIssues } open 
                                        </a> / {this.state.jiraCommitment.totalIssues } Total
                                        
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by customers" 
                                            placement = "top">
                                            <p>Security issues by customers</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 
                                            {this.state.jiraSecCust.openIssues } open 
                                        </a> / {this.state.jiraSecCust.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by external security researchers and OSS users" 
                                            placement = "top">
                                            <p>Security issues by external testing</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link" > 
                                            {this.state.jiraSecExt.openIssues } open 
                                        </a> / {this.state.jiraSecExt.totalIssues } Total
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <Tooltip title = "Shows security issues identified by internal security testing" 
                                            placement = "top">
                                            <p>Security issues by internal testing</p>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell> 
                                        <a href = "Link" > 
                                            {this.state.jiraSecInt.openIssues } open 
                                        </a> / {this.state.jiraSecInt.totalIssues } Total
                                    </TableCell>
                                </TableRow>


                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                            <p> <b>L1 Issues</b> </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link"> { this.state.gitIssues.L1Issues } </a> 
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                            <p> <b>L2 Issues</b> </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link"> { this.state.gitIssues.L2Issues } </a>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                            <p> <b>L3 Issues</b> </p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link"> { this.state.gitIssues.L3Issues } </a>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                        <p><b>Code coverage</b></p>
                                    </TableCell>
                                    <TableCell>
                                        <ul>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.instructionCov }</a>
                                                 % : Instruction coverage
                                            </li>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.complexityCov }</a>
                                                % : Complexity coverage
                                            </li>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.lineCov }</a>
                                                % : Line coverage
                                            </li>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.methodCov }</a>
                                                % : Method coverage
                                            </li>
                                            <li>
                                                <a href = "Link">{ this.state.codeCoverage.classCov }</a>
                                                % : Class coverage 
                                            </li>

                                        </ul>
                                        
                                    
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> GREEN </b> </TableCell>
                                    <TableCell align = "center">
                                            <p><b>Merged PRs with pending Doc tasks</b></p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link">{ this.state.mergedPRCount.mprCount }</a> 
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell> <b> RED </b> </TableCell>
                                    <TableCell align = "center">
                                            <p><b>Dependancies where the next version available is smaller than a patch</b></p>
                                    </TableCell>
                                    <TableCell>
                                        <a href = "Link">{ this.state.dependencySummary.dependencySummary }</a> 
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}
 
global.dashboard.registerWidget('HelloWorld', withStyles(styles, {withTheme: true})(HelloWorld));