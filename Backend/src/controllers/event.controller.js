import { Event } from "../models/event.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// @desc    Create a new event
// @route   POST /api/v1/events
// @access  Admin
export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    venue,
    type,
    registrationOpen,
    registrationDeadline,
    maxParticipants,
    status,
  } = req.body;

  // Handle image upload if exists
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  // Create event object
  const event = await Event.create({
    title,
    description,
    date: new Date(date),
    time,
    venue,
    type,
    registrationOpen: registrationOpen !== undefined ? registrationOpen : true,
    registrationDeadline: registrationDeadline
      ? new Date(registrationDeadline)
      : undefined,
    maxParticipants,
    status: status || "upcoming",
    ...(imageUrl && { image: imageUrl }),
  });

  res
    .status(201)
    .json(new ApiResponse(201, { event }, "Event created successfully"));
});

// @desc    Get all events with optional filtering
// @route   GET /api/v1/events
// @access  Public
export const getAllEvents = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Set up filtering
  const filter = {};

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by type
  if (req.query.type) {
    filter.type = req.query.type;
  }

  // Filter by date range
  if (req.query.fromDate) {
    filter.date = { $gte: new Date(req.query.fromDate) };
  }

  if (req.query.toDate) {
    filter.date = {
      ...filter.date,
      $lte: new Date(req.query.toDate),
    };
  }

  // Filter by registrationOpen
  if (req.query.registrationOpen) {
    filter.registrationOpen = req.query.registrationOpen === "true";
  }

  // Search in title or description
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Execute query
  const events = await Event.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ date: 1 }); // Sort by upcoming date

  // Get total count
  const totalEvents = await Event.countDocuments(filter);

  // Return events with pagination info
  res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
        pagination: {
          page,
          limit,
          totalEvents,
          totalPages: Math.ceil(totalEvents / limit),
        },
      },
      "Events fetched successfully"
    )
  );
});

// @desc    Get a single event
// @route   GET /api/v1/events/:id
// @access  Public
export const getEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find event by ID
  const event = await Event.findById(id).populate({
    path: "participants",
    select: "name email studentId department",
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if user is registered for the event
  let isRegistered = false;
  if (req.user) {
    isRegistered = event.participants.some(
      (participant) => participant._id.toString() === req.user._id.toString()
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        event,
        isRegistered,
      },
      "Event fetched successfully"
    )
  );
});

// @desc    Update an event
// @route   PUT /api/v1/events/:id
// @access  Admin
export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    time,
    venue,
    type,
    registrationOpen,
    registrationDeadline,
    maxParticipants,
    status,
  } = req.body;

  // Find event by ID
  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Handle image update if exists
  if (req.file) {
    event.image = `/uploads/${req.file.filename}`;
  }

  // Update event fields
  if (title) event.title = title;
  if (description) event.description = description;
  if (date) event.date = new Date(date);
  if (time) event.time = time;
  if (venue) event.venue = venue;
  if (type) event.type = type;
  if (registrationOpen !== undefined) event.registrationOpen = registrationOpen;
  if (registrationDeadline)
    event.registrationDeadline = new Date(registrationDeadline);
  if (maxParticipants) event.maxParticipants = maxParticipants;
  if (status) event.status = status;

  // Save updated event
  await event.save();

  res
    .status(200)
    .json(new ApiResponse(200, { event }, "Event updated successfully"));
});

// @desc    Delete an event
// @route   DELETE /api/v1/events/:id
// @access  Admin
export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find event by ID
  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Delete event
  await Event.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, {}, "Event deleted successfully"));
});

// @desc    Register for an event
// @route   POST /api/v1/events/:id/register
// @access  Private
export const registerForEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Find event by ID
  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if registration is still open
  if (!event.registrationOpen) {
    throw new ApiError(400, "Registration for this event is closed");
  }

  // Check if registration deadline has passed
  if (
    event.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline)
  ) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  // Check if event has reached capacity
  if (
    event.maxParticipants &&
    event.participants.length >= event.maxParticipants
  ) {
    throw new ApiError(400, "Event has reached maximum capacity");
  }

  // Check if user is already registered
  if (event.participants.includes(userId)) {
    throw new ApiError(400, "You are already registered for this event");
  }

  // Add user to event participants
  event.participants.push(userId);
  await event.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Registered for event successfully"));
});

// @desc    Cancel event registration
// @route   DELETE /api/v1/events/:id/register
// @access  Private
export const cancelEventRegistration = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Find event by ID
  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Check if user is registered
  const isRegistered = event.participants.includes(userId);
  if (!isRegistered) {
    throw new ApiError(400, "You are not registered for this event");
  }

  // Check if cancellation is allowed (e.g. not too close to event date)
  const today = new Date();
  const eventDate = new Date(event.date);
  const daysDifference = Math.floor(
    (eventDate - today) / (1000 * 60 * 60 * 24)
  );

  // Prevent cancellation if event is less than 1 day away or already started
  if (daysDifference < 1) {
    throw new ApiError(
      400,
      "Registration cannot be cancelled as the event is starting soon or has already started"
    );
  }

  // Remove user from event participants
  event.participants = event.participants.filter(
    (participantId) => participantId.toString() !== userId.toString()
  );
  await event.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Event registration canceled successfully"));
});
