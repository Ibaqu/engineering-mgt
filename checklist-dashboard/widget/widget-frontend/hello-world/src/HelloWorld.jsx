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
            
            dependencySummary : { dependencySummary : 0, refLink : ""},
            codeCoverage : { instructionCov : 0, branchCov : 0, complexityCov : 0, 
                lineCov : 0, methodCov : 0, classCov : 0, refLink : ""
            },
            gitIssues : { L1Issues : 0, L2Issues : 0, L3Issues : 0, refLink :"" },
            mergedPRCount : { mprCount : 0, refLink : "" },
            jiraPerf : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecScan : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraCommitment : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecCust : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecExt : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecInt : { totalIssues : 0, openIssues : 0, refLink : "" },
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
            console.log("Handling change");
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
            console.log("Resetting metrics");
            this.resetState();
           
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
            //let dependencyURL = "https://www.mocky.io/v2/5cc011df310000170e036016";
            console.log("Dependency URL :" + dependencyURL);

            let codeCoverageURL = hostUrl + '/codeCoverage/' + this.state.selected_ProductName;
            //let codeCoverageURL = "https://www.mocky.io/v2/5cc0121a3100009f0a036018";
            console.log("Code Coverage URL :" + codeCoverageURL);

            let gitIssuesURL = hostUrl + '/gitIssues/' + this.state.selected_ProductName;
            //let gitIssuesURL = "https://www.mocky.io/v2/5cc01e0a310000580b036090";
            gitIssuesURL = appendQuery(gitIssuesURL, infoVersion);
            console.log("Git Issues URL :" + gitIssuesURL);
            
            let mergedPRCountURL = hostUrl + '/mprCount/' + this.state.selected_ProductName;
            //let mergedPRCountURL = "https://www.mocky.io/v2/5cc012933100007e0f036024"    
            mergedPRCountURL = appendQuery(mergedPRCountURL, infoTitle);
            console.log("Merged PR URL :" + mergedPRCountURL);

            let jiraIssueTypes = ['perf-report', 'sec-scan', 'commitment', 'sec-cust', 'sec-ext', 'sec-int'];
            

            //Jira issue : Performance Report
            let infoPerf = {  version : this.state.selected_ProductVersion.versionNumber, issueType : 'perf-report' }
            let jiraURL = hostUrl + '/jiraIssues/' + this.state.selected_ProductName;
            //let jiraURL = "https://www.mocky.io/v2/5cc01cee3100007d0e036086";
            jiraURL = appendQuery(jiraURL, infoPerf);

            axios.create({
                withCredentials : false,
            })
            .get(jiraURL)
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
            let infoSecScan = {  version : this.state.selected_ProductVersion.versionNumber, issueType : 'sec-scan' }
            jiraUrl = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            //jiraURL = "https://www.mocky.io/v2/5cc01cbb310000bf0b036084";
            jiraURL = appendQuery(jiraURL, infoSecScan);

            axios.create({
                withCredentials : false,
            })
            .get(jiraURL)
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
            let infoCommitment = {version : this.state.selected_ProductVersion.versionNumber, issueType : 'commitment'}
            jiraURL = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            //jiraURL = "https://www.mocky.io/v2/5cc01d663100007d0e03608a";
            jiraURL = appendQuery(jiraURL, infoCommitment);

            axios.create({
                withCredentials : false,
            })
            .get(jiraURL)
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
            let infoSecCust = {  version : this.state.selected_ProductVersion.versionNumber, issueType : 'sec-cust' }
            jiraURL = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            //jiraURL = "https://www.mocky.io/v2/5cc01cee3100007d0e036086";
            jiraURL = appendQuery(jiraURL, infoSecCust);

            axios.create({
                withCredentials : false,
            })
            .get(jiraURL)
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
            let infoSecExt = { version : this.state.selected_ProductVersion.versionNumber, issueType : 'sec-ext' }
            jiraURL = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            //jiraURL = "https://www.mocky.io/v2/5cc01d94310000bf0b03608d";
            jiraURL = appendQuery(jiraURL, infoSecExt);

            axios.create({
                withCredentials : false,
            })
            .get(jiraURL)
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
            let infoSecInt = {  version : this.state.selected_ProductVersion.versionNumber, issueType : 'sec-int' }
            jiraURL = hostUrl + '/jiraIssues/' + this.state.selectedProductName;
            //jiraURL = "https://www.mocky.io/v2/5cc01d663100007d0e03608a";
            jiraURL = appendQuery(jiraURL, infoSecInt);

            axios.create({
                withCredentials : false,
            })
            .get(jiraURL)
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

    resetState() {
        this.setState({
            dependencySummary : { dependencySummary : 0, refLink : ""},
            codeCoverage : { instructionCov : 0, branchCov : 0, complexityCov : 0, 
                lineCov : 0, methodCov : 0, classCov : 0, refLink : ""
            },
            gitIssues : { L1Issues : 0, L2Issues : 0, L3Issues : 0, refLink :"" },
            mergedPRCount : { mprCount : 0, refLink : "" },
            jiraPerf : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecScan : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraCommitment : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecCust : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecExt : { totalIssues : 0, openIssues : 0, refLink : "" },
            jiraSecInt : { totalIssues : 0, openIssues : 0, refLink : "" },
        })
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
                        <h2><center> Release Readiness Metrics </center></h2>
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