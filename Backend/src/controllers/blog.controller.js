import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// @desc    Create a new blog post
// @route   POST /api/v1/blogs
// @access  Private
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category, tags } = req.body;
  const author = req.user._id;

  // Validate required fields
  if (!title || !content || !category) {
    throw new ApiError(
      400,
      "Missing required fields: title, content, category are required"
    );
  }

  // Check for empty strings after trimming
  if (title.trim() === "" || content.trim() === "" || category.trim() === "") {
    throw new ApiError(400, "Title, content, and category cannot be empty");
  }

  // Validate tags if provided
  let parsedTags = [];
  if (tags) {
    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

      // Validate that tags are not empty strings
      if (Array.isArray(parsedTags)) {
        parsedTags = parsedTags.filter(
          (tag) => tag && typeof tag === "string" && tag.trim() !== ""
        );
        if (parsedTags.length === 0 && tags) {
          throw new ApiError(400, "Tags cannot be empty");
        }
      } else {
        throw new ApiError(400, "Tags must be an array");
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(400, "Invalid tags format");
    }
  }

  // Create blog object
  const blog = await Blog.create({
    title: title.trim(),
    content: content.trim(),
    author,
    category: category.trim(),
    tags: parsedTags,
    status: "pending",
  });

  // Populate author details
  const createdBlog = await Blog.findById(blog._id).populate({
    path: "author",
    select: "name email",
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { blog: createdBlog },
        "Blog created successfully and pending approval"
      )
    );
});

// @desc    Get all blog posts with optional filtering
// @route   GET /api/v1/blogs
// @access  Admin
export const getAllBlogs = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Set up filtering
  const filter = {};

  // Public API should only show approved blogs
  if (req.user?.role === "admin") {
    if (req.query.status) {
      filter.status = req.query.status;
    }
  } else {
    filter.status = "approved";
  }

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Filter by tag
  if (req.query.tag) {
    filter.tags = { $in: [req.query.tag] };
  }

  // Filter by author
  if (req.query.author) {
    filter.author = req.query.author;
  }

  // Search in title or content
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { content: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Execute query
  const blogs = await Blog.find(filter)
    .populate({
      path: "author",
      select: "name email",
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Get total count
  const totalBlogs = await Blog.countDocuments(filter);

  // Return blogs with pagination info
  res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs,
        pagination: {
          page,
          limit,
          totalBlogs,
          totalPages: Math.ceil(totalBlogs / limit),
        },
      },
      "Blogs fetched successfully"
    )
  );
});


// @desc    Get all approved blog posts with optional filtering
// @route   GET /api/v1/blogs
// @access  Public
export const getAllApprovedBlogs = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Set up filtering
  const filter = {};


  filter.status = "approved";

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Filter by tag
  if (req.query.tag) {
    filter.tags = { $in: [req.query.tag] };
  }

  // Filter by author
  if (req.query.author) {
    filter.author = req.query.author;
  }

  // Search in title or content
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { content: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Execute query
  const blogs = await Blog.find(filter)
    .populate({
      path: "author",
      select: "name email",
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Get total count
  const totalBlogs = await Blog.countDocuments(filter);

  // Return blogs with pagination info
  res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs,
        pagination: {
          page,
          limit,
          totalBlogs,
          totalPages: Math.ceil(totalBlogs / limit),
        },
      },
      "Blogs fetched successfully"
    )
  );
});

// @desc    Get a single blog post
// @route   GET /api/v1/blogs/:id
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find blog by ID
  const blog = await Blog.findById(id).populate({
    path: "author",
    select: "name email",
  });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Check if user has permission to view non-approved blogs
  if (
    blog.status !== "approved" &&
    (!req.user ||
      (req.user.role !== "admin" && !blog.author._id.equals(req.user._id)))
  ) {
    throw new ApiError(403, "You do not have permission to view this blog");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { blog }, "Blog fetched successfully"));
});

// @desc    Update a blog post
// @route   PUT /api/v1/blogs/:id
// @access  Private (Owner or Admin)
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;

  // Find blog by ID
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Check if user is owner or admin
  if (!blog.author.equals(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to update this blog");
  }

  // Validate fields if provided
  if (title && title.trim() === "") {
    throw new ApiError(400, "Title cannot be empty");
  }

  if (content && content.trim() === "") {
    throw new ApiError(400, "Content cannot be empty");
  }

  if (category && category.trim() === "") {
    throw new ApiError(400, "Category cannot be empty");
  }

  // Validate tags if provided
  let parsedTags = blog.tags;
  if (tags) {
    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

      // Validate that tags are not empty strings
      if (Array.isArray(parsedTags)) {
        parsedTags = parsedTags.filter(
          (tag) => tag && typeof tag === "string" && tag.trim() !== ""
        );
      } else {
        throw new ApiError(400, "Tags must be an array");
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(400, "Invalid tags format");
    }
  }

  // Update blog fields
  blog.title = title ? title.trim() : blog.title;
  blog.content = content ? content.trim() : blog.content;
  blog.category = category ? category.trim() : blog.category;
  blog.tags = parsedTags;

  // If user updates their own post, reset status to pending
  if (blog.author.equals(req.user._id) && req.user.role !== "admin") {
    blog.status = "pending";
  }

  // Save updated blog
  await blog.save();

  // Populate author details for response
  const updatedBlog = await Blog.findById(blog._id).populate({
    path: "author",
    select: "name email",
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, { blog: updatedBlog }, "Blog updated successfully")
    );
});

// @desc    Delete a blog post
// @route   DELETE /api/v1/blogs/:id
// @access  Private (Owner or Admin)
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find blog by ID
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Check if user is owner or admin
  if (!blog.author.equals(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to delete this blog");
  }

  // Delete blog
  await Blog.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, {}, "Blog deleted successfully"));
});

// @desc    Update blog approval status
// @route   PATCH /api/v1/blogs/:id/status
// @access  Admin
export const updateBlogStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Find blog by ID
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Update blog status
  blog.status = status;

  // If blog is being approved, set published date
  if (status === "approved") {
    blog.publishedDate = Date.now();
  }

  // Save updated blog
  await blog.save();

  // Populate author details for response
  const updatedBlog = await Blog.findById(blog._id).populate({
    path: "author",
    select: "name email",
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { blog: updatedBlog },
        `Blog ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "status updated"} successfully`
      )
    );
});

// @desc    Get current user's blogs with optional filtering
// @route   GET /api/v1/blogs/my-blogs
// @access  Private
export const getMyBlogs = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Set up filtering
  const filter = { author: userId };

  // Filter by status if provided
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
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
    ];
  }

  // Execute query
  const blogs = await Blog.find(filter)
    .populate({
      path: "author",
      select: "name email",
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Get total count
  const totalBlogs = await Blog.countDocuments(filter);

  // Return blogs with pagination info
  res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs,
        pagination: {
          page,
          limit,
          totalBlogs,
          totalPages: Math.ceil(totalBlogs / limit),
        },
      },
      "User blogs fetched successfully"
    )
  );
});
