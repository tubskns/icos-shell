import React, { useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Grid,
    Paper,
    Divider,
    IconButton,
    Tooltip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Storage as ClusterIcon,
    Computer as NodeIcon,
    Person as AgentIcon,
    Info as InfoIcon,
    Visibility as VisibilityIcon,
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const JobManagerView = ({ data }) => {
    const [expanded, setExpanded] = useState({});

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded({
            ...expanded,
            [panel]: isExpanded
        });
    };

    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No job groups available
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No applications or deployments are currently running in the ICOS ecosystem.
                </Typography>
            </Card>
        );
    }

    const getStateColor = (state) => {
        switch (state?.toLowerCase()) {
            case 'deployed': return 'success';
            case 'degraded': return 'warning';
            case 'undeployed': return 'error';
            case 'running': return 'success';
            case 'pending': return 'info';
            default: return 'default';
        }
    };

    const getStateIcon = (state) => {
        switch (state?.toLowerCase()) {
            case 'deployed': return '✅';
            case 'degraded': return '⚠️';
            case 'undeployed': return '❌';
            case 'running': return '🏃';
            case 'pending': return '⏳';
            default: return '❓';
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <ClusterIcon sx={{ mr: 1 }} />
                ICOS Job Groups ({data.length})
            </Typography>

            {data.map((group, index) => (
                <Accordion 
                    key={group.id || index}
                    expanded={expanded[group.id] || false}
                    onChange={handleAccordionChange(group.id)}
                    sx={{ mb: 2, boxShadow: 2 }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                    📦 {group.appName || 'Unknown Application'}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Chip 
                                    label={`${group.jobs?.length || 0} Jobs`}
                                    size="small"
                                    color="primary"
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body2" color="text.secondary">
                                    {group.appDescription || 'No description available'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    
                    <AccordionDetails>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Application Details
                            </Typography>
                            
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                        <Typography variant="body2"><strong>Group ID:</strong> {group.id}</Typography>
                                        <Typography variant="body2"><strong>App Name:</strong> {group.appName}</Typography>
                                        <Typography variant="body2"><strong>Description:</strong> {group.appDescription}</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {group.jobs && group.jobs.length > 0 ? (
                                <>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Jobs ({group.jobs.length})
                                    </Typography>
                                    
                                    <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Job Name</strong></TableCell>
                                                    <TableCell><strong>State</strong></TableCell>
                                                    <TableCell><strong>Type</strong></TableCell>
                                                    <TableCell><strong>Orchestrator</strong></TableCell>
                                                    <TableCell><strong>Cluster</strong></TableCell>
                                                    <TableCell><strong>Node</strong></TableCell>
                                                    <TableCell><strong>Agent</strong></TableCell>
                                                    <TableCell><strong>Namespace</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {group.jobs.map((job, jobIndex) => (
                                                    <TableRow key={job.id || jobIndex} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                                {job.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {job.id}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={`${getStateIcon(job.state)} ${job.state || 'Unknown'}`}
                                                                color={getStateColor(job.state)}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip label={job.type || 'Unknown'} size="small" />
                                                        </TableCell>
                                                        <TableCell>{job.orchestrator || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <ClusterIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                {job.clustername || 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <NodeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                {job.nodename || 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <AgentIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                                {job.icosagent || 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{job.namespace || 'N/A'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            ) : (
                                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No jobs found in this group
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}

            {/* Summary Statistics */}
            <Card sx={{ mt: 3, p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    📊 ICOS Ecosystem Summary
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h4">{data.length}</Typography>
                        <Typography variant="body2">Total Applications</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h4">
                            {data.reduce((total, group) => total + (group.jobs?.length || 0), 0)}
                        </Typography>
                        <Typography variant="body2">Total Jobs</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h4">
                            {new Set(data.flatMap(group => 
                                group.jobs?.map(job => job.clustername).filter(Boolean) || []
                            )).size}
                        </Typography>
                        <Typography variant="body2">Active Clusters</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h4">
                            {new Set(data.flatMap(group => 
                                group.jobs?.map(job => job.icosagent).filter(Boolean) || []
                            )).size}
                        </Typography>
                        <Typography variant="body2">ICOS Agents</Typography>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};

export default JobManagerView;