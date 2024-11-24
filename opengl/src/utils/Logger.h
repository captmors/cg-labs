#pragma once

#include <spdlog/sinks/basic_file_sink.h>
#include <spdlog/sinks/stdout_color_sinks.h>
#include <spdlog/spdlog.h>


class Logger {
public:
    static void init() {
        auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
        auto file_sink = std::make_shared<spdlog::sinks::basic_file_sink_mt>("logs/game.log", true);

        auto logger = std::make_shared<spdlog::logger>("game", spdlog::sinks_init_list{ console_sink, file_sink });
        logger->set_level(spdlog::level::debug);
        logger->flush_on(spdlog::level::debug);

        spdlog::set_default_logger(logger);
    }
};
