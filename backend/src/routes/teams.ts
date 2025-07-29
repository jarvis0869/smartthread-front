import { Router } from 'express';
import { mockTeamMembers } from '../data/mockData.js';
import { ApiResponse, TeamMember } from '../types/index.js';

const router = Router();

// GET /api/teams - Get all team members
router.get('/', (req, res) => {
  try {
    const { department, status, limit = '50', offset = '0' } = req.query;
    
    let filteredMembers = [...mockTeamMembers];
    
    // Filter by department if provided
    if (department && typeof department === 'string') {
      filteredMembers = filteredMembers.filter(member => 
        member.department.toLowerCase() === department.toLowerCase()
      );
    }
    
    // Filter by status if provided
    if (status && typeof status === 'string') {
      filteredMembers = filteredMembers.filter(member => member.status === status);
    }
    
    // Apply pagination
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);
    const paginatedMembers = filteredMembers.slice(offsetNum, offsetNum + limitNum);
    
    const response: ApiResponse<{
      members: TeamMember[];
      total: number;
      limit: number;
      offset: number;
    }> = {
      success: true,
      data: {
        members: paginatedMembers,
        total: filteredMembers.length,
        limit: limitNum,
        offset: offsetNum
      }
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch team members'
    };
    res.status(500).json(response);
  }
});

// GET /api/teams/:id - Get specific team member
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const member = mockTeamMembers.find(m => m.id === id);
    
    if (!member) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Team member not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<TeamMember> = {
      success: true,
      data: member
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch team member'
    };
    res.status(500).json(response);
  }
});

// POST /api/teams - Add new team member
router.post('/', (req, res) => {
  try {
    const memberData = req.body;
    
    // Basic validation
    if (!memberData.name || !memberData.email) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Name and email are required'
      };
      return res.status(400).json(response);
    }
    
    // Check if email already exists
    const existingMember = mockTeamMembers.find(m => m.email === memberData.email);
    if (existingMember) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Team member with this email already exists'
      };
      return res.status(409).json(response);
    }
    
    const newMember: TeamMember = {
      id: `${Date.now()}`, // Simple ID generation for demo
      name: memberData.name,
      email: memberData.email,
      role: memberData.role || 'Team Member',
      department: memberData.department || 'General',
      status: 'offline',
      joinDate: new Date().toISOString().split('T')[0],
      location: memberData.location || '',
      phone: memberData.phone || '',
      lastActive: new Date().toISOString(),
      threadsParticipated: 0,
      tasksCompleted: 0
    };
    
    // Add to mock data (in memory for demo)
    mockTeamMembers.push(newMember);
    
    const response: ApiResponse<TeamMember> = {
      success: true,
      data: newMember,
      message: 'Team member added successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to add team member'
    };
    res.status(500).json(response);
  }
});

// PUT /api/teams/:id - Update team member
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const memberIndex = mockTeamMembers.findIndex(m => m.id === id);
    
    if (memberIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Team member not found'
      };
      return res.status(404).json(response);
    }
    
    // Update member data
    const updatedMember = {
      ...mockTeamMembers[memberIndex],
      ...req.body,
      id // Ensure ID doesn't change
    };
    
    mockTeamMembers[memberIndex] = updatedMember;
    
    const response: ApiResponse<TeamMember> = {
      success: true,
      data: updatedMember,
      message: 'Team member updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update team member'
    };
    res.status(500).json(response);
  }
});

export default router;