import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ContentStatus } from "../constants.js";
import mongoose from "mongoose";

// @desc    Create a new blog post
// @route   POST /api/v1/blogs
// @access  Private
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category, tags, summary } = req.body;
  const author = req.user._id;

  // Handle image upload if exists
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  // Create blog object
  const blog = await Blog.create({
    title,
    content,
    author,
    category,
    tags: tags ? JSON.parse(tags) : [],
    status: "pending",
    summary,
    ...(imageUrl && { image: imageUrl }),
  });

  // Populate author details
  const createdBlog = await Blog.findById(blog._id).populate({
    path: "author",
    select: "name email studentId",
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
// @access  Public
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
      select: "name email studentId",
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
    select: "name email studentId",
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
  const { title, content, category, tags, summary } = req.body;

  // Find blog by ID
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Check if user is owner or admin
  if (!blog.author.equals(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to update this blog");
  }

  // Handle image update if exists
  if (req.file) {
    blog.image = `/uploads/${req.file.filename}`;
  }

  // Update blog fields
  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.category = category || blog.category;
  blog.tags = tags ? JSON.parse(tags) : blog.tags;
  blog.summary = summary || blog.summary;

  // If user updates their own post, reset status to pending
  if (blog.author.equals(req.user._id) && req.user.role !== "admin") {
    blog.status = "pending";
  }

  // Save updated blog
  await blog.save();

  // Populate author details for response
  const updatedBlog = await Blog.findById(blog._id).populate({
    path: "author",
    select: "name email studentId",
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
    select: "name email studentId",
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
