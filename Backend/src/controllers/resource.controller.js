import { Resource } from "../models/resource.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ResourceCategories, ResourceLevels } from "../constants.js";
import mongoose from "mongoose";

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// @desc    Create a new resource
// @route   POST /api/v1/resources
// @access  Admin
export const createResource = asyncHandler(async (req, res) => {
  const { title, category, level, tags, content, externalLinks } = req.body;
  const author = req.user._id;

  // Handle file upload if exists
  let fileUrl = null;
  if (req.file) {
    fileUrl = `/uploads/${req.file.filename}`;
  }

  // Parse externalLinks if it's a string
  let formattedExternalLinks = externalLinks;
  if (typeof externalLinks === "string") {
    try {
      formattedExternalLinks = JSON.parse(externalLinks);
    } catch (error) {
      formattedExternalLinks = [];
    }
  }

  // Convert level to proper case format for the model
  const formattedLevel = level ? capitalizeFirstLetter(level) : undefined;

  // Create resource object
  const resource = await Resource.create({
    title,
    category,
    level: formattedLevel,
    tags: tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : [],
    content,
    author,
    externalLinks: formattedExternalLinks || [],
    ...(fileUrl && { file: fileUrl }),
  });

  // Populate author details
  const createdResource = await Resource.findById(resource._id).populate({
    path: "author",
    select: "name email",
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { resource: createdResource },
        "Resource created successfully"
      )
    );
});

// @desc    Get all resources with optional filtering by category/level
// @route   GET /api/v1/resources
// @access  Public
export const getAllResources = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Set up filtering
  const filter = {};

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Filter by level - handle case conversion
  if (req.query.level) {
    filter.level = capitalizeFirstLetter(req.query.level);
  }

  // Filter by tag
  if (req.query.tag) {
    filter.tags = { $in: [req.query.tag] };
  }

  // Search in title or content
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { content: { $regex: req.query.search, $options: "i" } },
      { tags: { $in: [new RegExp(req.query.search, "i")] } },
    ];
  }

  // Execute query
  const resources = await Resource.find(filter)
    .populate({
      path: "author",
      select: "name email",
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Get total count
  const totalResources = await Resource.countDocuments(filter);

  // Get categories and levels for filtering UI - capitalize resource levels for UI
  const categories = Object.values(ResourceCategories);
  const levels = Object.values(ResourceLevels).map((level) =>
    capitalizeFirstLetter(level)
  );

  // Return resources with pagination info and metadata
  res.status(200).json(
    new ApiResponse(
      200,
      {
        resources,
        pagination: {
          page,
          limit,
          totalResources,
          totalPages: Math.ceil(totalResources / limit),
        },
        metadata: {
          categories,
          levels,
        },
      },
      "Resources fetched successfully"
    )
  );
});

// @desc    Get a single resource
// @route   GET /api/v1/resources/:id
// @access  Public
export const getResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find resource by ID
  const resource = await Resource.findById(id).populate({
    path: "author",
    select: "name email",
  });

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { resource }, "Resource fetched successfully"));
});

// @desc    Update a resource
// @route   PUT /api/v1/resources/:id
// @access  Admin
export const updateResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, category, level, tags, content, externalLinks } = req.body;

  // Find resource by ID
  const resource = await Resource.findById(id);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  // Handle file update if exists
  if (req.file) {
    resource.file = `/uploads/${req.file.filename}`;
  }

  // Parse externalLinks if it's a string
  let formattedExternalLinks = externalLinks;
  if (typeof externalLinks === "string") {
    try {
      formattedExternalLinks = JSON.parse(externalLinks);
    } catch (error) {
      formattedExternalLinks = resource.externalLinks; // Keep existing if parse fails
    }
  }

  // Update resource fields
  if (title) resource.title = title;
  if (category) resource.category = category;
  if (level) resource.level = capitalizeFirstLetter(level);
  if (tags) resource.tags = typeof tags === "string" ? JSON.parse(tags) : tags;
  if (content) resource.content = content;
  if (formattedExternalLinks) resource.externalLinks = formattedExternalLinks;

  // Save updated resource
  await resource.save();

  // Populate author details for response
  const updatedResource = await Resource.findById(resource._id).populate({
    path: "author",
    select: "name email",
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resource: updatedResource },
        "Resource updated successfully"
      )
    );
});

// @desc    Delete a resource
// @route   DELETE /api/v1/resources/:id
// @access  Admin
export const deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find resource by ID
  const resource = await Resource.findById(id);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  // Delete resource
  await Resource.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Resource deleted successfully"));
});
